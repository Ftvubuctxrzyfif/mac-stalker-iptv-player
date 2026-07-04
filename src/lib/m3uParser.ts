export interface M3UChannel {
  name: string;
  logo?: string;
  group: string;
  streamUrl: string;
}

export interface M3UPlaylist {
  channels: M3UChannel[];
  categories: Set<string>;
}

/**
 * Parse M3U playlist content
 * Supports #EXTM3U and #EXTINF format
 */
export function parseM3U(content: string): M3UPlaylist {
  const lines = content.split('\n');
  const channels: M3UChannel[] = [];
  const categories = new Set<string>();
  
  let currentInfo = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Start of playlist
    if (line.startsWith('#EXTM3U')) {
      continue;
    }
    
    // Channel info
    if (line.startsWith('#EXTINF:')) {
      currentInfo = line;
      continue;
    }
    
    // Stream URL (non-comment line)
    if (!line.startsWith('#')) {
      if (currentInfo) {
        const channel = parseExtInf(currentInfo, line);
        if (channel) {
          channels.push(channel);
          if (channel.group) {
            categories.add(channel.group);
          }
        }
        currentInfo = '';
      }
    }
  }
  
  return { channels, categories };
}

/**
 * Parse EXTINF line and extract channel information
 * Format: #EXTINF:-1 tvg-id="" tvg-name="" tvg-logo="" group-title="Channel Name",Channel Name
 */
function parseExtInf(extInf: string, streamUrl: string): M3UChannel | null {
  try {
    // Remove #EXTINF:
    const info = extInf.substring(8).trim();
    
    // Extract attributes
    const tvgLogoMatch = info.match(/tvg-logo="([^"]*)"/);
    const groupTitleMatch = info.match(/group-title="([^"]*)"/);
    
    // Extract channel name (after comma)
    const commaIndex = info.lastIndexOf(',');
    const channelName = commaIndex > -1 ? info.substring(commaIndex + 1).trim() : 'Unknown Channel';
    
    return {
      name: channelName,
      logo: tvgLogoMatch ? tvgLogoMatch[1] : undefined,
      group: groupTitleMatch ? groupTitleMatch[1] : 'Uncategorized',
      streamUrl: streamUrl.trim(),
    };
  } catch (error) {
    console.error('Error parsing EXTINF line:', error);
    return null;
  }
}

/**
 * Fetch and parse M3U playlist from URL
 */
export async function fetchM3UPlaylist(url: string): Promise<M3UPlaylist> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.statusText}`);
    }
    
    const content = await response.text();
    return parseM3U(content);
  } catch (error) {
    console.error('Error fetching M3U playlist:', error);
    throw error;
  }
}

/**
 * Convert parsed playlist to database format
 */
export function playlistToDbChannels(playlist: M3UPlaylist, playlistId: number, portalId: number) {
  return playlist.channels.map((channel, index) => ({
    portal_id: portalId,
    playlist_id: playlistId,
    channel_id: `ch_${Date.now()}_${index}`,
    name: channel.name,
    logo_url: channel.logo,
    stream_url: channel.streamUrl,
    category_id: channel.group,
    provider_category: channel.group,
    provider_group_id: channel.group,
    sort_order: index,
    is_favorite: 0,
  }));
}

/**
 * Convert categories to database format
 */
export function playlistToDbCategories(playlist: M3UPlaylist, portalId: number) {
  return Array.from(playlist.categories).map((category, index) => ({
    portal_id: portalId,
    category_id: category,
    name: category,
    logo_url: undefined,
    sort_order: index,
  }));
}
