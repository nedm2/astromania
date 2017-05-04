import pygame, sys, math, time, uuid, random

def toint(i): return int(round(i))

frameWidth = 1200.0
frameHeight = 800.0
playingAreaWidth = 1200.0
playingAreaHeight = 760.0
windowScale = 0.8
frameRate = 60
frameCounter = 0
maxFrameCount = 1000000000
stage = 0
tinyFloat = 0.0000001
winWidth = toint(frameWidth*windowScale)
winHeight = toint(frameHeight*windowScale)

def secondsToTicks(s):
  return s*frameRate

def drawBackground(surf, backgrounds, gameSequence):
  level = gameSequence.getLevel()
  if level == 0:
    pass
  else:
    surf.blit(backgrounds[level], backgrounds[level].get_rect())

def scaleImages(images):
  for k in images.keys():
    w, h = images[k].get_size()
    images[k] = pygame.transform.scale(images[k], (toint(w*windowScale), toint(h*windowScale)))

def scaleSprites(sprites):
  for k in sprites.keys():
    w, h = sprites[k].image.get_size()
    sprites[k].image = pygame.transform.scale(sprites[k].image, (toint(w*windowScale), toint(h*windowScale)))
    sprites[k].image.set_colorkey((255, 0, 255))

def createSprite(img):
  newSprite = pygame.sprite.Sprite()
  imgSurf = pygame.image.load(img)
  w, h = imgSurf.get_size()
  imgSurf.set_colorkey((255, 0, 255))
  newSprite.image = pygame.transform.scale(imgSurf, (toint(w*windowScale), toint(h*windowScale)))
  return newSprite

def processEvents(events, controlElements):
  #global key_input
  #key_input = dict(zip(key_input.keys(), [False]*len(key_input)))
  for event in events: 
    if event.type == pygame.QUIT: 
      pygame.quit()
      sys.exit(0)
    elif event.type == pygame.KEYDOWN or event.type == pygame.KEYUP:
      if event.key in controlElements['input'].getValidKeys():
        controlElements['input'].processEvent(event)

class GameSequenceEntry():
  def __init__(self, enemies=[], prepause=0, postpause=0):
    self.enemies = enemies
    self.prepause = prepause
    self.postpause = postpause
    self.state = 'unstarted'

  def action(self, gameElements):
    if self.state == 'unstarted':
      self.state = 'prepause'
      self.lastActionTime = frameCounter
    elif self.state == 'prepause' and self.timeHasElapsed(self.prepause):
      self.state = 'waitenemies'
      for e in self.enemies:
        gameElements['pawn' + uuid.uuid4().__str__()] = e
      self.lastActionTime = frameCounter
    elif self.state == 'waitenemies' and gameElements.noEnemyShips():
      self.state = 'postpause'
      self.lastActionTime = frameCounter
    elif self.state == 'postpause' and self.timeHasElapsed(self.postpause):
      self.state = 'complete'
      self.lastActionTime = frameCounter
      
  def stageComplete(self):
    return self.state == 'complete'

  def timeHasElapsed(self, t):
    return (frameCounter - self.lastActionTime > t)

class GameSequence(dict):
  def __init__(self, level=0, stage=0):
    self.current = (level, stage)

  def action(self, gameElements):
    self[self.current].action(gameElements)

  def advanceStage(self):
    level, stage = self.current
    if (level, stage+1) in self.keys():
      stage += 1
    elif (level+1, 0) in self.keys():
      level += 1
      stage = 0
    else:
      level = 0
      stage = 0
    self.current = level, stage

  def stageComplete(self):
    return self[self.current].stageComplete()

  def getLevel(self):
    return self.current[0]

  def getStage(self):
    return self.current[1]

  def getCurrent(self):
    return self[self.current]

class GameElementDict(dict):
  def noEnemyShips(self):
    for k in self.keys():
      if 'pawn' in k:
        return False
    return True
    

class Vector:
  def __init__(self, x=0, y=0):
    self.x = float(x)
    self.y = float(y)

  def __add__(self, other):
    return Vector(self.x + other.x, self.y + other.y)

  def __sub__(self, other):
    return Vector(self.x - other.x, self.y - other.y)

  def __mul__(self, scale):
    return Vector(scale*self.x, scale*self.y)

  def __rmul__(self, scale):
    return self*scale

  def int_x(self):
    return toint(self.x)

  def int_y(self):
    return toint(self.y)

  def get_x(self):
    return self.x

  def get_y(self):
    return self.y

  def magnitude(self):
    return math.sqrt(self.x**2 + self.y**2)

  def unit_vector(self):
    if abs(self.x) < tinyFloat and abs(self.y) < tinyFloat:
      return Vector(0,0)
    else:
      return Vector(self.x/self.magnitude(), self.y/self.magnitude())

  def angle_rad(self):
    return math.atan2(self.y, self.x)

  def getComponent(self, theta):
    alpha = self.angle_rad() - theta
    magnitude = math.cos(alpha)*self.magnitude()
    return Vector(math.cos(theta)*magnitude, math.sin(theta)*magnitude)

  def getNormalComponent(self, theta):
    alpha = self.angle_rad() - theta
    magnitude = math.sin(alpha)*self.magnitude()
    return Vector(math.cos(theta + (math.pi/2))*magnitude, math.sin(theta + (math.pi/2))*magnitude)

  def __str__(self):
    return "Vector (%.3f, %.3f)" % (self.x, self.y)

  def distance(self, v):
    return math.sqrt((self.x - v.x)**2 + (self.y - v.y)**2)
    
  def __repr__(self):
    return self.__str__()

def vectorToDirection(v):
  a = v.angle_rad()
  if a > -math.pi/8 and a < math.pi/8:
    direction = 'r'
  elif a > math.pi/8 and a < math.pi*3.0/8:
    direction = 'ur'
  elif a > math.pi*3.0/8 and a < math.pi*5.0/8:
    direction = 'u'
  elif a > math.pi*5.0/8 and a < math.pi*7.0/8:
    direction = 'ul'
  elif a > math.pi*7.0/8 or a < -math.pi*7.0/8:
    direction = 'l'
  elif a > -math.pi*7.0/8 and a < -math.pi*5.0/8:
    direction = 'dl'
  elif a > -math.pi*5.0/8 and a < -math.pi*3.0/8:
    direction = 'd'
  elif a > -math.pi*3.0/8 and a < -math.pi*1.0/8:
    direction = 'dr'
  else:
    direction = 'ur' # default
  return direction

class KeyboardInput:
  UP = 0
  BOUNCE = 1
  DOWN = 2
  def __init__(self):
    self.validKeys = (pygame.K_UP, pygame.K_DOWN, pygame.K_RIGHT, pygame.K_LEFT, pygame.K_SPACE)
    self.key_states = dict(zip(self.validKeys, [KeyboardInput.UP]*len(self.validKeys)))
    self.key_event_time = dict(zip(self.validKeys, [0]*len(self.validKeys)))
    self.bounceTime = 5

  def getValidKeys(self):
    return self.validKeys

  def processEvent(self, event):
    if event.type == pygame.KEYDOWN:
      self.key_states[event.key] = KeyboardInput.DOWN
      self.key_event_time[event.key] = frameCounter
    elif event.type == pygame.KEYUP:
      self.key_states[event.key] = KeyboardInput.BOUNCE
      self.key_event_time[event.key] = frameCounter

  def update(self):
    for k1 in (pygame.K_UP, pygame.K_DOWN):
      for k2 in (pygame.K_RIGHT, pygame.K_LEFT):
        if self.key_states[k1] == KeyboardInput.BOUNCE and self.key_states[k2] == KeyboardInput.BOUNCE:
          self.key_states[k1] = self.key_states[k2] = KeyboardInput.UP

    for k in self.validKeys:
      if self.key_states[k] == KeyboardInput.BOUNCE and \
          (frameCounter - self.key_event_time[k])%maxFrameCount > self.bounceTime:
        self.key_states[k] = KeyboardInput.UP

  def getKeyStates(self):
    newDict = {}
    for key in self.validKeys:
      newDict[key] = self.key_states[key] in (KeyboardInput.DOWN, KeyboardInput.BOUNCE)
    return newDict

  def getKeyDownStates(self):
    newDict = {}
    for key in self.validKeys:
      newDict[key] = self.key_states[key] == KeyboardInput.DOWN
    return newDict

  def getKeyEventTimes(self):
    return self.key_event_time

  def __str__(self):
    s = ''
    s += 'up: %i, ' % self.key_states[pygame.K_UP]
    s += 'down: %i, ' % self.key_states[pygame.K_DOWN]
    s += 'right: %i, ' % self.key_states[pygame.K_RIGHT]
    s += 'left: %i, ' % self.key_states[pygame.K_LEFT]
    return s
    

class Drawable(object):
  def __init__(self, screen, position, radius, sprites, frameCoords=False):
    self.screen = screen
    self.position = position
    self.sprites = sprites
    self.radius = radius
    self.frameCoords = frameCoords
    self.shakeCount = 0
    self.shakeRadius = 5
    self.active = True

  def draw(self, spritename=None):
    if spritename:
      s = self.sprites[spritename]
    else:
      s = self.sprites.values()[0]
    if self.frameCoords:
      h = frameHeight
    else: 
      h = playingAreaHeight
    if self.shakeCount > 0:
      actual_x = self.position.get_x() - self.shakeRadius + int(random.random()*self.shakeRadius*2)
      actual_y = self.position.get_y() - self.shakeRadius + int(random.random()*self.shakeRadius*2)
    else:
      actual_x = self.position.get_x()
      actual_y = self.position.get_y()
    s.rect = s.image.get_rect()
    s.rect.topleft = [toint(windowScale*(actual_x - self.radius)), 
      h*windowScale - toint(windowScale*(actual_y + self.radius))]
    self.screen.blit(s.image, s.rect)
    if self.shakeCount > 0:
      self.shakeCount -= 1

  def isOutOfPlayingArea(self):
    if self.position.get_x() < 0 or self.position.get_x() > playingAreaWidth or \
       self.position.get_y() < 0 or self.position.get_y() > playingAreaHeight:
      return True
    else:
      return False

  def getType(self):
    return 'generic'

  def shake(self, c):
    self.shakeCount = c

  def update(self, gameElements, controlElements):
    pass

  def markInactive(self):
    self.active = False

  def onremoval(self, elementsToPush):
    pass

class Explosion(Drawable):
  def __init__(self, screen, position, duration=secondsToTicks(1)):
    sprites = {
      '0' : createSprite("sprites/pawn/expl/pawnexpl0.GIF"),
      '1' : createSprite("sprites/pawn/expl/pawnexpl1.GIF"),
      '2' : createSprite("sprites/pawn/expl/pawnexpl2.GIF"),
      '3' : createSprite("sprites/pawn/expl/pawnexpl3.GIF")
    }
    self.timeleft = duration
    self.duration = duration
    super(Explosion, self).__init__(screen, position, 50, sprites)
    self.shakeCount = duration
    self.shakeRadius = 2

  def draw(self):
    if self.timeleft > 0:
      spriteIndex = (self.duration - self.timeleft)/(self.duration/4)
      super(Explosion, self).draw(spritename=str(spriteIndex))
      self.timeleft -= 1

  def getType(self):
    return 'explosion'

class Dashboard():
  def __init__(self, screen, ship, sprites):
    self.ship = ship
    self.outline = Drawable(screen, Vector(0, frameHeight*0.05), 0, {'outline': sprites['outline']}, frameCoords=True)
    self.divides = [
      Drawable(screen, Vector(frameWidth*0.15, frameHeight*0.035), 0, {'divide': sprites['divide']}, frameCoords=True),
      Drawable(screen, Vector(frameWidth*0.3,  frameHeight*0.035), 0, {'divide': sprites['divide']}, frameCoords=True),
      Drawable(screen, Vector(frameWidth*0.45, frameHeight*0.035), 0, {'divide': sprites['divide']}, frameCoords=True)
    ]
    self.font = pygame.font.SysFont("monospace", toint(winHeight*0.02), bold=True)

  def draw(self):
    for d in [self.outline] + self.divides: 
      d.draw()
    label = self.font.render("Health: " + str(int(self.ship.getHealth())), 1, (255,0,0))
    screen.blit(label, (winWidth*0.015, winHeight*(1 - 0.025)))
    label = self.font.render("Speed: " + str(int(self.ship.getSpeed())), 1, (255,0,0))
    screen.blit(label, (winWidth*(0.15 + 0.0125 + 0.015), winHeight*(1 - 0.025)))
    label = self.font.render("Score: " + str(int(self.ship.getScore())), 1, (255,0,0))
    screen.blit(label, (winWidth*(0.3 + 0.0125 + 0.015), winHeight*(1 - 0.025)))
    

class Craft(Drawable):
  def __init__(self, screen, position, velocity, health, radius, sprites):
    super(Craft, self).__init__(screen, position, radius, sprites)
    self.velocity = velocity
    self.health = health
    self.shielded = 0
    self.mass = 100

  def draw(self, direction=None, prefix=''):
    if not direction:
      a = self.velocity.angle_rad()
      if a > -math.pi/8 and a < math.pi/8:
        direction = 'r'
      elif a > math.pi/8 and a < math.pi*3.0/8:
        direction = 'ur'
      elif a > math.pi*3.0/8 and a < math.pi*5.0/8:
        direction = 'u'
      elif a > math.pi*5.0/8 and a < math.pi*7.0/8:
        direction = 'ul'
      elif a > math.pi*7.0/8 or a < -math.pi*7.0/8:
        direction = 'l'
      elif a > -math.pi*7.0/8 and a < -math.pi*5.0/8:
        direction = 'dl'
      elif a > -math.pi*5.0/8 and a < -math.pi*3.0/8:
        direction = 'd'
      elif a > -math.pi*3.0/8 and a < -math.pi*1.0/8:
        direction = 'dr'

    if self.shakeCount > 0:
      prefix = 'hit' + prefix
    super(Craft, self).draw(prefix + direction)

  def updatePosition(self):
    self.position = self.position + self.velocity

  def update(self, gameElements, controlElements):
    self.updatePosition()

  def getHealth(self):
    return self.health

  def getSpeed(self):
    return toint(self.velocity.magnitude())

  def getType(self):
    return 'craft'

  def damage(self, d, safeperiod=0):
    if not self.shielded:
      self.shielded = safeperiod
      self.shake(safeperiod)
      self.health = max(0, self.health - d)
      if self.health <= 0:
        self.markInactive()

  def onremoval(self, elementsToPush):
    elementsToPush['expl' + uuid.uuid4().__str__()] = Explosion(self.screen, self.position)

class Bullet(Drawable):
  def __init__(self, owner, screen, position, velocity, radius, sprites, power=1):  
    super(Bullet, self).__init__(screen, position, radius, sprites)
    self.owner = owner
    self.velocity = velocity
    self.power = power

  def update(self, gameElements, controlElements):
    self.position = self.position + self.velocity

  def draw(self):
    super(Bullet, self).draw('bullet')

  def getType(self):
    return (self.owner.getType() + 'bullet')
    

class Ship(Craft):
  def __init__(self, screen, radius, sprites, bulletRadius, bulletSprites, position=Vector(playingAreaWidth/2, playingAreaHeight/2), 
      velocity=Vector(0,0), health=100):
    super(Ship, self).__init__(screen, position, velocity, health, radius, sprites)
    self.direction = Vector(0,0)
    self.key_sensitivity = 0.1
    self.resistance = 0.008
    self.forces = Vector()
    self.fireFrequency = frameRate
    self.bulletRadius = bulletRadius
    self.bulletSprites = bulletSprites
    self.bulletPower = 1
    self.direction = Vector(1, 0).unit_vector()
    self.bulletSpeed = 15
    self.score = 0
    self.acceleration=0.5
    self.impactdamage = 2

  def updateDirection(self, controlElements):
    keys = controlElements['input'].getKeyStates()
    if True in (
        keys[pygame.K_UP], 
        keys[pygame.K_DOWN], 
        keys[pygame.K_RIGHT], 
        keys[pygame.K_LEFT]
        ):
      x, y = 0, 0
      if keys[pygame.K_UP]:
        y = 1.0
      elif keys[pygame.K_DOWN]:
        y = -1.0
      if keys[pygame.K_RIGHT]:
        x = 1.0
      elif keys[pygame.K_LEFT]:
        x = -1.0
      self.direction = Vector(x, y).unit_vector()

  def updateForces(self, controlElements):
    keys = controlElements['input'].getKeyStates()
    f = Vector()
    if keys[pygame.K_UP]:
      f.y = 1
    elif keys[pygame.K_DOWN]:
      f.y = -1
    if keys[pygame.K_RIGHT]:
      f.x = 1
    elif keys[pygame.K_LEFT]:
      f.x = -1
    self.forces = f.unit_vector()

  def updateVelocity(self):
    self.velocity = (self.velocity + self.forces*self.acceleration)
    self.velocity = self.velocity - self.velocity*self.resistance

  def updatePosition(self):
    super(Ship, self).updatePosition()
    if self.position.get_x() < 0:
      self.position.x = float(playingAreaWidth)
    if self.position.get_x() > playingAreaWidth:
      self.position.x = float(0)
    if self.position.get_y() < 0:
      self.position.y = float(playingAreaHeight)
    if self.position.get_y() > playingAreaHeight:
      self.position.y = float(0)

  def fire(self, gameElements):
    gameElements['shipbullet' + uuid.uuid4().__str__()] = \
      (Bullet(self, self.screen, self.position, self.direction*self.bulletSpeed, self.bulletRadius, self.bulletSprites))

  def updateFire(self, gameElements, controlElements):
    spaceDown = controlElements['input'].getKeyDownStates()[pygame.K_SPACE]
    if spaceDown:
      spacePressTime = controlElements['input'].getKeyEventTimes()[pygame.K_SPACE]
      if ((frameCounter - spacePressTime)%maxFrameCount)%self.fireFrequency == 0:
        self.fire(gameElements)

  def update(self, gameElements, controlElements):
    self.updateDirection(controlElements)
    self.updateForces(controlElements)
    self.updateVelocity()
    self.updatePosition()
    self.updateFire(gameElements, controlElements)
    if self.shielded > 0:
      self.shielded -= 1

  def getScore(self):
    return self.score

  def draw(self):
    super(Ship, self).draw(direction=vectorToDirection(self.direction))

  def getType(self):
    return 'ship'

class Pawn(Craft):
  def __init__(self, screen, radius, sprites, bulletRadius, bulletSprites, position=Vector(playingAreaWidth/2, playingAreaHeight/2), 
      velocity=Vector(0,0), health=100):
    super(Pawn, self).__init__(screen, position, velocity, health, radius, sprites)
    self.initialposition=position

  def update(self, gameElements, controlElements):
    super(Pawn, self).update(gameElements, controlElements)
    if self.isOutOfPlayingArea():
        self.position = self.initialposition
    if self.shielded > 0:
      self.shielded -= 1

  def getType(self):
    return 'pawn'

def momentum(a, b):
  impactVector = b.position - a.position
    
def collisions(gameElements):
  elementsToPop = set()
  elementsToPush = {}
  for i1 in range(len(gameElements)-1):
    for i2 in range(i1+1, len(gameElements)):
      k1 = gameElements.keys()[i1]
      k2 = gameElements.keys()[i2]
      ge1 = gameElements[k1]
      ge2 = gameElements[k2]
      if ge1.position.distance(ge2.position) < (ge1.radius + ge2.radius):
        if ('shipbullet' in (ge1.getType(),ge2.getType())) and ('pawn' in (ge1.getType(),ge2.getType())):
          (pawnkey, pawn, bulletkey, bullet) = (k1, ge1, k2, ge2) if ge1.getType() == 'pawn' else (k2, ge2, k1, ge1)
          pawn.damage(bullet.power, secondsToTicks(1))
          bullet.markInactive()
        elif ('ship' in (ge1.getType(),ge2.getType())) and ('pawn' in (ge1.getType(),ge2.getType())):
          (ship, pawn) = (ge1, ge2) if ge1.getType() == 'ship' else (ge2, ge1)
          ship.damage(ship.impactdamage, secondsToTicks(1))
          momentum(ship, pawn)
  for elem in elementsToPop:
    gameElements.pop(elem)
  gameElements.update(elementsToPush)

def game(gameElements, controlElements, gameSequence):
  if gameSequence.getLevel() > 0:
    #Update positions
    for k in gameElements.keys():
      ge = gameElements[k]
      ge.update(gameElements, controlElements)
      for s in ('bullet',):
        if k in gameElements.keys() and s in k and ge.isOutOfPlayingArea():
          gameElements.pop(k)
      if ge.getType() == 'explosion' and ge.timeleft == 0:
        gameElements.pop(k)
      if k in gameElements.keys():
        ge.draw()

    #Check for collisions
    collisions(gameElements)

    #Remove inactive elements
    elementsToPop = set()
    elementsToPush = {}
    for k in gameElements.keys():
      ge = gameElements[k]
      if not ge.active:
        elementsToPop.add(k)
        ge.onremoval(elementsToPush)
    for elem in elementsToPop:
      gameElements.pop(elem)
    gameElements.update(elementsToPush)

    gameSequence.action(gameElements)
    if gameSequence.stageComplete():
      gameSequence.advanceStage()


def test():
  theta = Vector(5, 5).angle_rad()
  a = Vector(5, -1)
  print a.getComponent(theta)
  print a.getNormalComponent(theta)
  print a.getComponent(theta) + a.getNormalComponent(theta)


if __name__ == "__main__":
  #test();sys.exit(0)
  pygame.init()
  window = pygame.display.set_mode((toint(winWidth), toint(winHeight)))
  pygame.display.set_caption('Space Attacks by Niall Murphy')
  screen = pygame.display.get_surface() 
  screen.set_colorkey((255, 0, 255))
  clock = pygame.time.Clock()

  """ Load sprites """

  backgrounds = {
      1: pygame.image.load("sprites/space.GIF"),
      2: pygame.image.load("sprites/overearth.GIF")
    }
  scaleImages(backgrounds)

  shipsprites = {
    'dl' : createSprite("sprites/ship/shipdl.GIF"),
    'd' : createSprite("sprites/ship/shipd.GIF"),
    'dr' : createSprite("sprites/ship/shipdr.GIF"),
    'r' : createSprite("sprites/ship/shipr.GIF"),
    'ur' : createSprite("sprites/ship/shipur.GIF"),
    'u' : createSprite("sprites/ship/shipu.GIF"),
    'ul' : createSprite("sprites/ship/shipul.GIF"),
    'l' : createSprite("sprites/ship/shipl.GIF"),
    'hitdl' : createSprite("sprites/ship/hitshipdl.GIF"),
    'hitd' : createSprite("sprites/ship/hitshipd.GIF"),
    'hitdr' : createSprite("sprites/ship/hitshipdr.GIF"),
    'hitr' : createSprite("sprites/ship/hitshipr.GIF"),
    'hitur' : createSprite("sprites/ship/hitshipur.GIF"),
    'hitu' : createSprite("sprites/ship/hitshipu.GIF"),
    'hitul' : createSprite("sprites/ship/hitshipul.GIF"),
    'hitl' : createSprite("sprites/ship/hitshipl.GIF")
  }

  pawn0Sprites = {
    'd' : createSprite("sprites/pawn/0/pawn0d.GIF"),
    'u' : createSprite("sprites/pawn/0/pawn0u.GIF"),
    'r' : createSprite("sprites/pawn/0/pawn0r.GIF"),
    'l' : createSprite("sprites/pawn/0/pawn0l.GIF"),
    'hitd' : createSprite("sprites/pawn/0/hitpawn0d.GIF"),
    'hitu' : createSprite("sprites/pawn/0/hitpawn0u.GIF"),
    'hitr' : createSprite("sprites/pawn/0/hitpawn0r.GIF"),
    'hitl' : createSprite("sprites/pawn/0/hitpawn0l.GIF")
  }

  pawn1Sprites = {
    'd' : createSprite("sprites/pawn/1/pawn1d.GIF"),
    'u' : createSprite("sprites/pawn/1/pawn1u.GIF"),
    'r' : createSprite("sprites/pawn/1/pawn1r.GIF"),
    'l' : createSprite("sprites/pawn/1/pawn1l.GIF"),
    'hitd' : createSprite("sprites/pawn/1/hitpawn1d.GIF"),
    'hitu' : createSprite("sprites/pawn/1/hitpawn1u.GIF"),
    'hitr' : createSprite("sprites/pawn/1/hitpawn1r.GIF"),
    'hitl' : createSprite("sprites/pawn/1/hitpawn1l.GIF")
  }

  pawn2Sprites = {
    'd' : createSprite("sprites/pawn/2/pawn2d.GIF"),
    'u' : createSprite("sprites/pawn/2/pawn2u.GIF"),
    'r' : createSprite("sprites/pawn/2/pawn2r.GIF"),
    'l' : createSprite("sprites/pawn/2/pawn2l.GIF"),
    'hitd' : createSprite("sprites/pawn/2/hitpawn2d.GIF"),
    'hitu' : createSprite("sprites/pawn/2/hitpawn2u.GIF"),
    'hitr' : createSprite("sprites/pawn/2/hitpawn2r.GIF"),
    'hitl' : createSprite("sprites/pawn/2/hitpawn2l.GIF")
  }

  bulletSprites = {
    'bullet' : createSprite("sprites/bullet.GIF")
  }

  dashSprites = {
    'outline' : createSprite("sprites/ship/dash/dashbar.GIF"),
    'divide' : createSprite("sprites/ship/dash/divide.GIF")
  }

  """ Create persistent game elements """
  gameElements = GameElementDict()
  gameElements['ship'] = Ship(screen, radius=25.0, sprites=shipsprites, bulletRadius=5.0, bulletSprites=bulletSprites)

  """ Create dashboard """
  dash = Dashboard(screen, gameElements['ship'], dashSprites)

  controlElements = {
    'input' : KeyboardInput()
  }

  #gameSequence = GameSequence(level=1, stage=0)
  gameSequence = GameSequence(level=1, stage=3)
  gameSequence[(0,0)] = None
  gameSequence[(1,0)] = GameSequenceEntry(
    prepause=secondsToTicks(2),
    enemies=[Pawn(screen, 22, pawn0Sprites, 0, None, position=Vector(0, i), velocity=3*Vector(1,0), health=1) \
      for i in (125,300,475,650)]
  )
  gameSequence[(1,1)] = GameSequenceEntry(
    prepause=secondsToTicks(2),
    enemies=[Pawn(screen, 22, pawn0Sprites, 0, None, position=Vector(playingAreaWidth, i), velocity=4*Vector(-1,0), health=1) \
      for i in (125,300,475,650)]
  )
  gameSequence[(1,2)] = GameSequenceEntry(
    prepause=secondsToTicks(2),
    enemies=[Pawn(screen, 22, pawn0Sprites, 0, None, position=Vector(0, i), velocity=5*Vector(1,0), health=1) \
      for i in (125,300,475,650)]
  )
  gameSequence[(1,3)] = GameSequenceEntry(
    prepause=secondsToTicks(2),
    enemies=[Pawn(screen, 22, pawn1Sprites, 0, None, position=Vector(0, i), velocity=3*Vector(1,0), health=2) \
      for i in (125,300,475,650)]
  )

  """ Main game loop """
  while True:
    """ Clear the screen """
    screen.fill((0,0,0))

    """ Check for events """
    processEvents(pygame.event.get(), controlElements)
    controlElements['input'].update()

    """ Draw the background """
    drawBackground(screen, backgrounds, gameSequence)

    """ Update all game elements """
    game(gameElements, controlElements, gameSequence)

    """ Draw the dashboard """
    dash.draw()

    """ Draw everything to the screen """
    pygame.display.flip()


    """ Wait for next frame """
    clock.tick(frameRate)

    """ Tick onto next frame """
    frameCounter = (frameCounter + 1)%maxFrameCount



""" 
TODO LIST
* More formal frame counter which takes care of overflow
"""
