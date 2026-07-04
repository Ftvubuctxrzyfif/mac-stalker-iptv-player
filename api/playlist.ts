import { connect } from "npm:@tursodatabase/serverless@^0.1.0";

export default async function(req: Request): Promise<Response> {
  const body = await req.json();
  const { action, playlistId, portalId } = body;
  
  // Get database connection info from headers
  const url = req.headers.get("x-database-url");
  const token = req.headers.get("x-database-token");
  
  if (!url || !token) {
    return Response.json({ error: "Database connection not available" }, { status: 500 });
  }

  const conn = connect({ url, authToken: token });

  try {
    if (action === 'fetchM3U') {
      const { m3uUrl } = body;
      
      // Fetch the M3U playlist
      const response = await fetch(m3uUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Parse M3U content
      const lines = content.split('\n');
      const channels: any[] = [];
      const categories = new Set<string>();
      
      let currentInfo = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line) continue;
        if (line.startsWith('#EXTM3U')) continue;
        
        if (line.startsWith('#EXTINF:')) {
          currentInfo = line;
          continue;
        }
        
        if (!line.startsWith('#') && currentInfo) {
          // Parse channel info
          const info = currentInfo.substring(8).trim();
          const tvgLogoMatch = info.match(/tvg-logo="([^"]*)"/);
          const groupTitleMatch = info.match(/group-title="([^"]*)"/);
          const commaIndex = info.lastIndexOf(',');
          const channelName = commaIndex > -1 ? info.substring(commaIndex + 1).trim() : 'Unknown Channel';
          const groupName = groupTitleMatch ? groupTitleMatch[1] : 'Uncategorized';
          
          channels.push({
            name: channelName,
            logo: tvgLogoMatch ? tvgLogoMatch[1] : undefined,
            group: groupName,
            streamUrl: line.trim(),
          });
          
          categories.add(groupName);
          currentInfo = '';
        }
      }
      
      // Save to database
      const playlistIdNum = parseInt(playlistId);
      const portalIdNum = parseInt(portalId);
      
      // Clear existing channels for this playlist
      const deleteStmt = conn.prepare("DELETE FROM channels WHERE playlist_id = ?");
      await deleteStmt.run([playlistIdNum]);
      
      // Insert channels
      const insertStmt = conn.prepare(`
        INSERT INTO channels (portal_id, playlist_id, channel_id, name, logo_url, stream_url, category_id, provider_category, provider_group_id, sort_order, is_favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `);
      
      for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        await insertStmt.run([
          portalIdNum,
          playlistIdNum,
          `ch_${Date.now()}_${i}`,
          channel.name,
          channel.logo,
          channel.streamUrl,
          channel.group,
          channel.group,
          channel.group,
          i,
        ]);
      }
      
      // Save categories
      const categoryStmt = conn.prepare(`
        INSERT INTO categories (portal_id, category_id, name, logo_url, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      let catIndex = 0;
      for (const category of categories) {
        await categoryStmt.run([
          portalIdNum,
          category,
          category,
          null,
          catIndex++,
        ]);
      }
      
      return Response.json({
        success: true,
        channelsCount: channels.length,
        categoriesCount: categories.size,
      });
    }
    
    if (action === 'getChannels') {
      const { playlistId: plId } = body;
      
      const stmt = conn.prepare(`
        SELECT * FROM channels 
        WHERE playlist_id = ? 
        ORDER BY sort_order ASC
      `);
      
      const channels = await stmt.all([parseInt(plId)]);
      
      return Response.json({
        success: true,
        channels: channels,
      });
    }
    
    if (action === 'getCategories') {
      const { portalId: pId } = body;
      
      // Get "All Channels" first
      const categories: any[] = [
        { _row_id: 1, name: 'All Channels', logo_url: undefined },
      ];
      
      const stmt = conn.prepare(`
        SELECT DISTINCT category_id as name, name 
        FROM categories 
        WHERE portal_id = ?
        ORDER BY name ASC
      `);
      
      const result = await stmt.all([parseInt(pId)]);
      
      for (let i = 0; i < result.length; i++) {
        categories.push({
          _row_id: i + 2,
          name: result[i].name,
          logo_url: undefined,
        });
      }
      
      return Response.json({
        success: true,
        categories: categories,
      });
    }
    
    return Response.json({ error: "Unknown action" }, { status: 400 });
    
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Internal error' 
    }, { status: 500 });
  }
}
