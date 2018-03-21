About
=====

This tool emulates an EMV-CAP device, to illustrate the article "Banque en
ligne : a la decouverte d'EMV-CAP" published in MISC #56.

Example of EMV-CAP calculators:

![EMV-CAP calculators](emvcap-calculators.jpg)

Screenshots
===========

USB smartcard reader with a bank card connected to a laptop running Linux:

![USB smartcard reader with a bank card](emvcap-usbreader.jpg)

Command line help:

```
$ ./EMV-CAP -h
usage: EMV-CAP [-h] [-l] [-L] [--tlv PARSETLV]
               [-r {<index>, <reader_substring>}] [-d] [-v] [-m {1,2}]
               [--warmreset {auto,yes,no}]
               [N [N ...]]

EMV-CAP calculator

optional arguments:
  -h, --help            show this help message and exit

Standalone options:
  -l, --listreaders     print list of available readers and exit
  -L, --listapps        print list of available applications on the card and
                        exit
  --tlv PARSETLV        parse a hex string into TLV elements

Global options:
  -r {<index>, <reader_substring>}, --reader {<index>, <reader_substring>}
                        select one specific reader with reader index, name
                        string or sub-string otherwise first reader found will
                        be used.
  -d, --debug           print exchanged APDU for debugging
  -v, --verbose         print APDU parsing

Modes and data:
  -m {1,2}, --mode {1,2}
                        M1/M2 mode selection (mandatory, unless -l or -L is
                        used)
  N                     number(s) as M1/M2 data: max one 8-digit number for M1
                        and max 10 10-digit numbers for M2
  --warmreset {auto,yes,no}
                        Warm reset: yes / no / auto (default) If 'auto' it
                        will perform a warm reset if the ATR starts with 3F
                        (indirect convention)

Examples:
    EMV-CAP --listreaders
    EMV-CAP --listapps
    EMV-CAP --listapps --debug --reader foo
    EMV-CAP -m1 123456
    EMV-CAP -m2
    EMV-CAP -m2 1000 3101234567
```

Mac OSX support
===============

EMV-CAP also works on Mac OSX (tested with Yosemite 10.10.5), you will need to install few dependencies though (you need to have pip and brew installed as prerequesite):

* brew: see the Brew homepage on how to install it
* pip: ``` sudo easy_install pip```
* swig: ```brew install swig```
* pycrypto and pyscard: ``` sudo pip install pycrypto pyscard ````

Todo
====

* make debian packages
* make a pip package
* make a docker image
* add support for some banks with boobank: http://weboob.org/applications/boobank
* add curl examples for a webbanking interface of choice

Links
=====

* http://connect.ed-diamond.com/MISC/MISC-056/Banques-en-ligne-a-la-decouverte-d-EMV-CAP
* https://sites.uclouvain.be/EMV-CAP/
* http://slideplayer.com/slide/11405563/
