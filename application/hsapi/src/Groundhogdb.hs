-- show
-- /show
{-# LANGUAGE GADTs, TypeFamilies, TemplateHaskell, QuasiQuotes, FlexibleInstances, StandaloneDeriving #-}

module Groundhogdb where

import Control.Monad.IO.Class (liftIO)
import Database.Groundhog
import Database.Groundhog.Generic
import Database.Groundhog.TH
import Database.Groundhog.Sqlite
import Data.Time
import GroundhogUtility

data Track = Track {
  trackTitle :: String,
  trackPath :: String,
  trackArtist :: String,
  trackAlbum :: String, 
  trackDuration :: Int,
  trackFileFormat :: String,
  trackSampleRate :: Double,
  trackBitsPerSample :: Int,
  trackGenre :: String,
  trackPublisher :: String,
  trackCarrierType :: String,
  trackYear :: Int
} deriving Show

data User = User {
  userFirstName :: String,
  userLastName :: String,
  userOccupation :: String,
  userYearOfBirth :: Int,
  userEmail :: String,
  userPasswordHash :: String,
  userPasswordSalt :: String,
  userAccountType :: Int,
  userLastActive :: UTCTime,
  userActivated :: Bool,
  userActivationCode :: String
} deriving Show

data Slot = Slot {
  slotTime :: UTCTime,
  slotEditorId :: DefaultKey User
} 
deriving instance Show Slot

data SlotRequest = SlotRequest {
  slotRequestTime :: UTCTime,
  slotRequestEditorId :: DefaultKey User,
  slotRequestDaysBitMask :: Int,
  slotRequestStartDate :: UTCTime,
  slotRequestEndDate :: UTCTime
}
deriving instance Show SlotRequest

data PlaylistTrack = PlaylistTrack {
  playlistTrackSlotId :: DefaultKey Slot,
  playlistTrackTrackId :: DefaultKey Track,
  playlistTrackIndex :: Int,
  playlistTrackPlayDuration :: Int
}
deriving instance Show PlaylistTrack

data Wish = Wish {
  wishTrackId :: DefaultKey Track,
  wishUserId :: DefaultKey User,
  wishDateTime :: UTCTime,
  wishIsTemporary :: Bool
}
deriving instance Show Wish

data RadioStation = RadioStation {
  radioStationName :: String,
  radioStationDescription :: String,
  radioStationOib :: String,
  radioStationAddress :: String,
  radioStationEmail :: String,
  radioStationFrequency :: Double
} deriving Show


mkPersist myCodegenConfig [groundhog|
- entity: Track
- entity: User
- entity: Slot
- entity: SlotRequest
- entity: PlaylistTrack
- entity: Wish
- entity: RadioStation
|]

createViewCountWishedTracks :: PersistBackend m => m ()
createViewCountWishedTracks = executeRaw True 
      "CREATE VIEW countWished AS SELECT trackId AS id, COUNT(*) AS counter FROM wish GROUP BY trackId ORDER BY counter DESC;" []

createViewCountPlaylistedTracks :: PersistBackend m => m ()
createViewCountPlaylistedTracks = executeRaw True 
      "CREATE VIEW countPlaylisted AS SELECT trackId AS id, COUNT(*) AS counter FROM playlistTrack GROUP BY trackId ORDER BY counter DESC;" []

deleteView :: PersistBackend m => String -> m ()
deleteView name = executeRaw True ("DROP VIEW " ++ name ++ ";") []

-- show
main :: IO ()
main = withSqliteConn "dbdb.db" $ runDbConn $ do
  runMigration $ do
    migrate (undefined :: Track)
    migrate (undefined :: User)
    migrate (undefined :: Slot)
    migrate (undefined :: SlotRequest)
    migrate (undefined :: PlaylistTrack)
    migrate (undefined :: Wish)
    migrate (undefined :: RadioStation)
  deleteView "countWished"
  deleteView "countPlaylisted"
  createViewCountWishedTracks
  createViewCountPlaylistedTracks
  -- johnKey <- insert $ Customer "John Doe" "0123456789"
  -- get johnKey >>= liftIO . print
  -- insert $ Product "Oranges" 3 johnKey
  -- insert $ Product "Apples" 5 johnKey
  -- janeKey <- insert $ Customer "Jane Doe" "9876543210"
  -- insert $ Product "Oranges" 4 janeKey
  -- johnOrders <- select $ (CustomerField ==. johnKey)
  --   `orderBy` [Asc ProductNameField]
  -- liftIO $ putStrLn $ "Products for John: " ++ show johnOrders
-- /show