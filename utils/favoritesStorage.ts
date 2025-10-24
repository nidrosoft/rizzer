/**
 * Favorites Storage Utility
 * Manages saving and retrieving favorites using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteItem, FavoritesCollection, FavoriteType } from '@/types/favorites';
import { errorLogger } from '@/services/logging/errorLogger';

const FAVORITES_KEY = '@rizzers_favorites';

// Get all favorites
export const getFavorites = async (): Promise<FavoritesCollection> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      dateIdeas: [],
      events: [],
      hiddenGems: [],
      datePlans: [],
    };
  } catch (error) {
    errorLogger.error(error as Error, { context: 'getFavorites' });
    return {
      dateIdeas: [],
      events: [],
      hiddenGems: [],
      datePlans: [],
    };
  }
};

// Save a favorite item
export const saveFavorite = async (item: FavoriteItem): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    
    // Determine which array to add to
    let key: keyof FavoritesCollection;
    switch (item.type) {
      case 'date_idea':
        key = 'dateIdeas';
        break;
      case 'event':
        key = 'events';
        break;
      case 'hidden_gem':
        key = 'hiddenGems';
        break;
      case 'date_plan':
        key = 'datePlans';
        break;
      default:
        return false;
    }
    
    // Check if already saved
    const exists = favorites[key].some(fav => fav.id === item.id);
    if (exists) {
      return false;
    }
    
    // Add to favorites
    favorites[key].push(item);
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    errorLogger.error(error as Error, { context: 'saveFavorite', item });
    return false;
  }
};

// Remove a favorite item
export const removeFavorite = async (id: string, type: FavoriteType): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    
    // Determine which array to remove from
    let key: keyof FavoritesCollection;
    switch (type) {
      case 'date_idea':
        key = 'dateIdeas';
        break;
      case 'event':
        key = 'events';
        break;
      case 'hidden_gem':
        key = 'hiddenGems';
        break;
      case 'date_plan':
        key = 'datePlans';
        break;
      default:
        return false;
    }
    
    // Remove from favorites
    favorites[key] = favorites[key].filter(fav => fav.id !== id);
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    errorLogger.error(error as Error, { context: 'removeFavorite', id, type });
    return false;
  }
};

// Check if item is favorited
export const isFavorited = async (id: string, type: FavoriteType): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    
    let key: keyof FavoritesCollection;
    switch (type) {
      case 'date_idea':
        key = 'dateIdeas';
        break;
      case 'event':
        key = 'events';
        break;
      case 'hidden_gem':
        key = 'hiddenGems';
        break;
      case 'date_plan':
        key = 'datePlans';
        break;
      default:
        return false;
    }
    
    return favorites[key].some(fav => fav.id === id);
  } catch (error) {
    errorLogger.error(error as Error, { context: 'isFavorited', id, type });
    return false;
  }
};

// Get favorites count
export const getFavoritesCount = async (): Promise<number> => {
  try {
    const favorites = await getFavorites();
    return (
      favorites.dateIdeas.length +
      favorites.events.length +
      favorites.hiddenGems.length +
      favorites.datePlans.length
    );
  } catch (error) {
    errorLogger.error(error as Error, { context: 'getFavoritesCount' });
    return 0;
  }
};

// Clear all favorites
export const clearAllFavorites = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    errorLogger.error(error as Error, { context: 'clearAllFavorites' });
    return false;
  }
};
