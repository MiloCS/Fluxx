from bs4 import BeautifulSoup
import requests
import urllib
import os
import json

def get_soup(url,header):
    return BeautifulSoup(urllib.request.urlopen(urllib.request.Request(url,headers=header)),'html.parser') 

def get_image(query, filename):
    query= query.split()
    query='+'.join(query)
    url="https://www.google.co.in/search?q="+query+"&source=lnms&tbm=isch#imgrc=lrZWSEnJ4PRowM"

    header={'User-Agent':"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36"}
    soup = get_soup(url,header)
    a = soup.find("img", {"class", "rg_i"})['src']#("div", {"class": "isv-r"})
    print(a)
    link = "https://www.pngitem.com/pimgs/m/29-293318_clip-art-ripped-vector-death-clipart-hd-png.png"
    try:
        #req = urllib.request.Request(link, headers={'User-Agent' : header})
        raw_img = requests.get(link)#urllib.request.urlopen(req).read()
        # if len(Type)==0:
        #     f = open(filename+".jpg", 'wb')
        # else :
        f = open(filename+".png", 'wb')


        f.write(raw_img.content)
        f.close()
    except Exception as e:
        print("could not load : "+link)

get_image("death clipart", "death")