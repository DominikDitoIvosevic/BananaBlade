{-# LANGUAGE NoMonomorphismRestriction, ScopedTypeVariables #-}

module Models where

import Database.Groundhog
import Database.Groundhog.Sqlite
import Groundhogdb
import Data.Time
import Control.Monad.IO.Class
import Data.List hiding (deleteBy)
import Data.Maybe
import ModelUtility
import Data.Ord

addTrack :: PersistBackend m => Track -> m ()
addTrack = insert_

editTrack :: PersistBackend m => DefaultKey Track -> Track -> m ()
editTrack = replace

removeTrack :: PersistBackend m => DefaultKey Track -> m ()
removeTrack = deleteBy

getCurrentlyPlaying :: (PersistBackend m, MonadIO m) => m PlaylistTrack
getCurrentlyPlaying = do
  currentTime <- liftIO getCurrentTime
  let slotStartTime = floorTimeToRoundHour currentTime
  currentSlotKey <- fmap head $ project AutoKeyField $ (SlotTimeField ==. slotStartTime) `limitTo` 1
  currentPlaylist <- getPlaylist currentSlotKey
  return $ fromMaybe (error "No track") $ currentTrack currentTime slotStartTime currentPlaylist

getPlaylist :: PersistBackend m => DefaultKey Slot -> m [PlaylistTrack]
getPlaylist slotKey = select $ (PlaylistTrackSlotIdField ==. slotKey) `orderBy` [Asc PlaylistTrackIndexField]

numberOfTimesWished :: PersistBackend m => DefaultKey Track -> m Int
numberOfTimesWished trackKey = count (PlaylistTrackTrackIdField ==. trackKey)

numberOfTimesPlayed :: PersistBackend m => DefaultKey Track -> m Int
numberOfTimesPlayed trackKey = count (WishTrackIdField ==. trackKey)
  
getMostPopular :: PersistBackend m => m [Track]
getMostPopular = do
  let mostPopularKeys :: [DefaultKey Track] = map fst' $ sortCriteria $ map getTriplet (sequence allKeys)
  fmap (take 5) $ select $ AutoKeyField `in_` mostPopularKeys
  where
    sortCriteria = sortOn (\(_, n1, n2) -> 2*n1 + 3*n2)
    getTriplet x = (x, numberOfTimesWished x, numberOfTimesPlayed x)
    
countOfTrackInPlaylist :: PersistBackend m => m [(DefaultKey Track, Int)]
countOfTrackInPlaylist = take 10 <$> project (PlaylistTrackTrackIdField, count CondEmpty)

allKeys :: PersistBackend m => m [AutoKey Track]
allKeys = map fst <$> project (AutoKeyField, TrackTitleField) CondEmpty

getCountOfWished :: PersistBackend m => m [(DefaultKey Track, Int)]
getCountOfWished = queryRaw True