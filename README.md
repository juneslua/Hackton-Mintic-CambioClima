# Cambio climatico - Hackaton Mintic (2021)

Hackaton 2021 en colaboración con la Universidad Industrial de santander y el Ministerio del las TIC.
 
- - - -

Para que el proyecto funcione se debe tener instalado mongodb, con una base de datos llamada 'Climatico'

El ingreso de los datos se dara por medio del siguient comando:
```
mongoimport --db climatico --collection temp_historica --type csv --headerline --ignoreBlanks --file ./datos/TempBOG_2015-2020.csv
mongoimport --db climatico --collection emisiones --type csv --headerline --ignoreBlanks --file ./datos/GasesInvenadero_2014V2.csv

```

