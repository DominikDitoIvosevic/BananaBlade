module Main where

import Lib
import qualified Groundhogdb

main :: IO ()
main = do
  Groundhogdb.main
  print "asd"
  startApp
