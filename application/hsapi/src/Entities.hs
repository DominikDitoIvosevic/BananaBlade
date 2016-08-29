-- module Entities where
--   
-- import Data.Time
-- 
-- 
-- data Track = Track {
--   title :: String,
--   path :: String,
--   artist :: String,
--   album :: String, 
--   duration :: Int,
--   file_format :: String,
--   sample_rate :: Double,
--   bits_per_sample :: Int,
--   genre :: String,
--   publisher :: String,
--   carrier_type :: String,
--   year :: Int
-- } deriving Show
-- 
-- data User = User {
--   first_name :: String,
--   last_name :: String,
--   occupation :: String,
--   year_of_birth :: Int,
--   email :: String,
--   password_hash :: String,
--   password_salt :: String,
--   account_type :: Int,
--   last_active :: UTCTime,
--   activated :: Bool,
--   activation_code :: String
-- } deriving Show
-- 
-- data Slot = Slot {
--   time :: UTCTime,
--   editor :: DefaultKey User
-- } 
-- deriving instance Show Slot
-- 
-- data SlotRequest = SlotRequest {
--   slotRequestTime :: UTCTime,
--   slotRequestEditor :: DefaultKey User,
--   slotRequestDays_bit_mask :: Int,
--   slotRequestStart_date :: UTCTime,
--   slotRequestEnd_date :: UTCTime
-- }
-- deriving instance Show SlotRequest
-- 
-- data PlaylistTrack = PlaylistTrack {
--   slot :: DefaultKey Slot,
--   track :: DefaultKey Track,
--   index :: Int,
--   play_duration :: Int
-- }
-- deriving instance Show PlaylistTrack
-- 
-- data Wish = Wish {
--   wishTrack :: DefaultKey Track,
--   wishUser :: DefaultKey User,
--   wishData_time :: UTCTime,
--   wishIs_temporary :: Bool
-- }
-- deriving instance Show Wish
-- 
-- data RadioStation = RadioStation {
--   radioStationName :: String,
--   radioStationDescription :: String,
--   radioStationOib :: String,
--   radioStationAddress :: String,
--   radioStationEmail :: String,
--   radioStationFrequency :: Double
-- } deriving Show