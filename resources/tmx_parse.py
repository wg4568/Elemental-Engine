from bs4 import BeautifulSoup
import base64
import json
import zlib

PATH = "C:\\Users\\wg456\\Desktop\\Defensio\\engine\\resources\\test.tmx"
LOCATION = "resources/"

with open(PATH, "r") as f:
	RAW = f.read()

soup = BeautifulSoup(RAW, "html.parser")

DIMENSIONS = (
	int(soup.map["width"]),
	int(soup.map["height"])
)

TILESIZE = (
	int(soup.map.tileset["tilewidth"]),
	int(soup.map.tileset["tileheight"])
)

TILEREF = {}
for tileset in soup.find_all("tileset"):
	gid = int(tileset["firstgid"])
	for tile in tileset.find_all("tile"):
		source = tile.image["source"]
		globalID = int(tile["id"])+gid
		TILEREF[globalID] = LOCATION + str(source)

MAPDATA = []
lines = soup.map.data.text.split("\n")
lines = map(lambda x: str(x).split(","), lines)
lines = filter(lambda x: len(x)>1, lines)
lines = map(lambda x: filter(lambda y: bool(y), x), lines)
lines = map(lambda x: map(int, x), lines)
for y in xrange(DIMENSIONS[1]):
	line = []
	for x in xrange(DIMENSIONS[0]):
		line.append(lines[y][x])
	MAPDATA.append(line)

JSON = {
	"tiles": TILEREF,
	"width": DIMENSIONS[0],
	"height": DIMENSIONS[1],
	"tileSize": TILESIZE[0],
	"mapData": MAPDATA
}

B64 = base64.b64encode(json.dumps(JSON))

COMPRESSED = zlib.compress(B64)

COMPRESSED_STRING = "var LEVEL = ["
for ind, val in enumerate(COMPRESSED):
	if ind != 0:
		COMPRESSED_STRING += ", "
	COMPRESSED_STRING += str(ord(val))
COMPRESSED_STRING += "];"

print COMPRESSED_STRING
