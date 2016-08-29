module ModelUtility where
  
import Data.Time
import Groundhogdb
import Data.List

getSeconds :: UTCTime -> Int
getSeconds time = floor $ utctDayTime time
 
getMinutes :: UTCTime -> Int
getMinutes time = getSeconds time `div` 60

getHours :: UTCTime -> Int
getHours time = getSeconds time `div` 3600

floorTimeToRoundHour :: UTCTime -> UTCTime
floorTimeToRoundHour t@(UTCTime a b) = UTCTime a $ fromIntegral $ getHours t * 3600

isTrackDuringNow :: UTCTime -> UTCTime -> (Int, Int, PlaylistTrack) -> Bool
isTrackDuringNow currentTime slotStartTime (begin, end, _) = begin < currentTimeInSlot && end > currentTimeInSlot
  where currentTimeInSlot = getSeconds currentTime - getSeconds slotStartTime
  
currentTrack :: UTCTime -> UTCTime -> [PlaylistTrack] -> Maybe PlaylistTrack
currentTrack currentTime slotStartTime tracks = fmap trd $ find (isTrackDuringNow currentTime slotStartTime) $ 
                                                  zip3 (0: calcBeginEnd tracks) (calcBeginEnd tracks) tracks

calcBeginEnd :: [PlaylistTrack] -> [Int]
calcBeginEnd playlist = scanl (+) 0 (map playlistTrackPlayDuration playlist)

trd :: (a, b, c) -> c
trd (_, _, c) = c

fst' :: (a, b, c) -> a
fst' (a, _, _) = a