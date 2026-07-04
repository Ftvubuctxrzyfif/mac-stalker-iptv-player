// Xtream Codes API integration helper

export interface XtreamCredentials {
  serverUrl: string;
  username: string;
  password: string;
}

export interface XtreamLiveStream {
  stream_id: number;
  name: string;
  stream_icon: string;
  category_id: string;
}

export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id?: number;
}

export interface XtreamAuthResponse {
  user_info: {
    username: string;
    status: string;
    exp_date?: string;
    max_connections?: number;
    allowed_output_formats?: string[];
  };
  server_info: {
    url: string;
    port: number;
    https_port: number;
    server_protocol?: string;
  };
}

/**
 * Authenticate with Xtream Codes API
 */
export async function xtreamAuth(credentials: XtreamCredentials): Promise<XtreamAuthResponse> {
  const { serverUrl, username, password } = credentials;
  
  const authUrl = `${serverUrl}/player_api.php?username=${username}&password=${password}`;
  
  try {
    const response = await fetch(authUrl);
    const data = await response.json();
    
    if (data.user_info?.status === 'Active' || data.user_info?.status === 'active') {
      return data;
    }
    
    throw new Error('Authentication failed');
  } catch (error) {
    console.error('Xtream auth error:', error);
    throw error;
  }
}

/**
 * Get live categories from Xtream Codes API
 */
export async function getLiveCategories(credentials: XtreamCredentials): Promise<XtreamCategory[]> {
  const { serverUrl, username, password } = credentials;
  const url = `${serverUrl}/player_api.php?username=${username}&password=${password}&action=get_live_categories`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching live categories:', error);
    return [];
  }
}

/**
 * Get live streams from Xtream Codes API
 */
export async function getLiveStreams(
  credentials: XtreamCredentials,
  categoryId?: string
): Promise<XtreamLiveStream[]> {
  const { serverUrl, username, password } = credentials;
  
  let url = `${serverUrl}/player_api.php?username=${username}&password=${password}&action=get_live_streams`;
  if (categoryId) {
    url += `&category_id=${categoryId}`;
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching live streams:', error);
    return [];
  }
}

/**
 * Get stream URL for playing
 */
export function getStreamUrl(
  credentials: XtreamCredentials,
  streamId: number,
  extension: string = 'm3u8'
): string {
  const { serverUrl, username, password } = credentials;
  return `${serverUrl}/live/${username}/${password}/${streamId}.${extension}`;
}

/**
 * Convert Xtream stream to database format
 */
export function xtreamStreamToDb(
  stream: XtreamLiveStream,
  portalId: number,
  playlistId: number
) {
  return {
    portal_id: portalId,
    playlist_id: playlistId,
    channel_id: `xtream_${stream.stream_id}`,
    name: stream.name,
    logo_url: stream.stream_icon,
    stream_url: `xtream://${stream.stream_id}`, // Special marker to generate URL on play
    category_id: stream.category_id,
    provider_category: stream.category_id,
    provider_group_id: stream.category_id,
    sort_order: 0,
    is_favorite: 0,
  };
}

/**
 * Convert Xtream category to database format
 */
export function xtreamCategoryToDb(
  category: XtreamCategory,
  portalId: number
) {
  return {
    portal_id: portalId,
    category_id: category.category_id.toString(),
    name: category.category_name,
    logo_url: undefined,
    sort_order: 0,
  };
}
