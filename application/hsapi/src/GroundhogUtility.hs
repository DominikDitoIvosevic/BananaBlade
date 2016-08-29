{-# LANGUAGE GADTs, TypeFamilies, FlexibleInstances #-}

module GroundhogUtility where
  
import Control.Monad.IO.Class (liftIO)
import Database.Groundhog
import Database.Groundhog.Generic
import Database.Groundhog.TH
import Database.Groundhog.Sqlite
import Data.Time
import Data.Char


myCodegenConfig :: CodegenConfig
myCodegenConfig = defaultCodegenConfig 
    { namingStyle = (namingStyle defaultCodegenConfig) 
        {  mkDbFieldName = myFieldNameFunction  } }
  where
    myFieldNameFunction name constructorName constructorPosition fieldRecordName fieldPosition = toLowerFirst $ drop (length constructorName) fieldRecordName
    toLowerFirst (x:xs) = toLower x : xs