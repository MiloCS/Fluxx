from PIL import Image, ImageDraw, ImageFont

pink = "#e069c1"
green = "#c4e069"
blue = "#03c2fc"
yellow = "#ebe359"

def add_corners(im, rad):
    circle = Image.new('L', (rad * 2, rad * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, rad * 2, rad * 2), fill=255)
    alpha = Image.new('L', im.size, 255)
    w, h = im.size
    alpha.paste(circle.crop((0, 0, rad, rad)), (0, 0))
    alpha.paste(circle.crop((0, rad, rad, rad * 2)), (0, h - rad))
    alpha.paste(circle.crop((rad, 0, rad * 2, rad)), (w - rad, 0))
    alpha.paste(circle.crop((rad, rad, rad * 2, rad * 2)), (w - rad, h - rad))
    im.putalpha(alpha)
    return im

def insert_newlines(str, width):
	lst = str.split(" ")
	currlen = 0
	newstr = ""
	for i in lst:
		if (currlen + len(i)) > width:
			newstr += "\n"
			newstr += i
			currlen = len(i)
		else:
			if len(newstr) > 0:
				newstr += " " 
			newstr += i
			currlen += len(i) + 1
	return newstr

def generate_card(type, color, name, logo, text, outfile):
	w = 200
	h = 300

	img = Image.new('RGB', (w, h), color = 'white')
	d = ImageDraw.Draw(img)
	shape = [(10, 10), (40, h - 10)]
	divider = [(50, h/2), (w - 10, h/2 + 5)] 
	d.rectangle(shape, fill=color)
	d.rectangle(divider, fill="#000000")

	logo = Image.open(logo)
	logo = logo.resize((23, 23), resample=Image.BILINEAR)
	img.paste(logo, box=(14, 14), mask=logo)

	#for card name above divider
	font = ImageFont.truetype("helveticab.ttf", 16)
	#for header
	largefont = ImageFont.truetype("helveticab.ttf", 26)
	#for description
	timesfont = ImageFont.truetype("times.ttf", 12)

	#put card name on sidebar
	font = ImageFont.truetype('helveticab.ttf', 22)
	width, height = font.getsize(name.upper())

	image2 = Image.new('RGBA', (width, height), (0, 0, 128, 0))
	draw2 = ImageDraw.Draw(image2)
	draw2.text((0, 0), text=name.upper(), font=font, fill="#000000")
	image2 = image2.rotate(90, expand=1)
	px, py = 17, 40
	sx, sy = image2.size
	if sy > (h - 60):
		image2 = image2.resize((sx, h-60), resample=Image.BILINEAR)
		sx, sy = image2.size
	img.paste(image2, (px, py, px + sx, py + sy), image2)

	#put in other pieces of text
	name_max_width = 12
	processed_name = insert_newlines(name, name_max_width)
	name_lines = processed_name.count("\n")
	d.text((50, 10), type.upper(), fill="#000000", font=largefont)
	d.multiline_text((50, h/2 - 20 - 20 *name_lines), processed_name, fill="#000000", font=font)
	d.multiline_text((50, h/2 + 10), insert_newlines(text, 28), fill="#000000", font=timesfont)

	#rounded corners for a more authetic playing card effect
	add_corners(img, 20)

	img.save(outfile)

#generate_card("New Rule", yellow, "Interstellar Spacecraft", "star.png", "X = X + 1!", "card.png")

with open("keepers.txt", "r") as f:
	keepers = f.read().split("\n")

with open("goals.txt", "r") as f:
	goals = f.read().split("\n")

with open("rules.txt", "r") as f:
	rules = f.read().split("\n")

with open("actions.txt", "r") as f:
	actions = f.read().split("\n")

for card in keepers:
	generate_card("Keeper", green, card, "check.png", "Filler keeper text while I'm still missing images", "cards/" + card.strip() + ".png")

for card in goals:
	split = card.split(":")
	name = split[0]
	desc = split[1]
	filename = name.replace(" ", "")
	generate_card("Goal", pink, name, "checkbox.png", desc, "cards/" + filename + ".png")

for card in rules:
	split = card.split(":")
	name = split[0]
	desc = split[1]
	filename = name.replace(" ", "")
	generate_card("New Rule", yellow, name, "star.png", desc, "cards/" + filename + ".png")

for card in actions:
	split = card.split(":")
	name = split[0]
	desc = split[1]
	filename = name.replace(" ", "")
	generate_card("Action", blue, name, "arrow.png", desc, "cards/" + filename + ".png")
