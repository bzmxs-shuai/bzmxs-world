import * as THREE from 'three'

const areaLabels = {
    library: {
        title: 'LIBRARY',
        subtitle: 'ACADEMIC & TECHNICAL NOTES',
        color: '#f4d38a'
    },
    'training-ground': {
        title: 'TRAINING GROUND',
        subtitle: 'ALGORITHMS & CHALLENGES',
        color: '#ff9d48'
    },
    home: {
        title: 'HOME',
        subtitle: 'LIFE, STORIES & MEMORIES',
        color: '#ffd8a8'
    }
}

export default class BlogAreasSection
{
    constructor(_options)
    {
        this.resources = _options.resources
        this.objects = _options.objects
        this.areas = _options.areas
        this.walls = _options.walls
        this.tiles = _options.tiles
        this.onAreaOpen = _options.onAreaOpen
        this.library = _options.library
        this.trainingGround = _options.trainingGround
        this.home = _options.home
        this.hideTextLabels = window.location.search.includes('hideLabels=1')

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.setLibrary()
        this.setTrainingGround()
        this.setHome()
    }

    makeLabel(_area, _x, _y, _z = 2.4)
    {
        if(this.hideTextLabels)
        {
            return
        }

        const label = areaLabels[_area]
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 256
        const context = canvas.getContext('2d')

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = 'rgba(44, 34, 22, 0.82)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.strokeStyle = label.color
        context.lineWidth = 14
        context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36)
        context.textAlign = 'center'
        context.fillStyle = '#fff7dc'
        context.font = '700 92px Arial'
        context.fillText(label.title, canvas.width / 2, 116)
        context.fillStyle = label.color
        context.font = '700 38px Arial'
        context.fillText(label.subtitle, canvas.width / 2, 178)
        context.fillStyle = '#fff7dc'
        context.font = '700 26px Arial'
        context.fillText('PRESS E / ENTER TO READ', canvas.width / 2, 218)

        const texture = new THREE.CanvasTexture(canvas)
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.LinearFilter

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(8.5, 2.125),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
        )
        mesh.position.set(_x, _y, _z)
        mesh.rotation.x = Math.PI * 0.5
        mesh.matrixAutoUpdate = false
        mesh.updateMatrix()
        this.container.add(mesh)
    }

    makeArea(_area, _x, _y, _halfX = 5, _halfY = 4)
    {
        const area = this.areas.add({
            position: new THREE.Vector2(_x, _y),
            halfExtents: new THREE.Vector2(_halfX, _halfY)
        })

        area.on('interact', () =>
        {
            this.onAreaOpen(_area)
        })

        return area
    }

    addProjectBoard(_x, _y, _rotation = 0)
    {
        return this.objects.add({
            base: this.resources.items.projectsBoardStructure.scene,
            collision: this.resources.items.projectsBoardCollision.scene,
            floorShadowTexture: this.resources.items.projectsBoardStructureFloorShadowTexture,
            offset: new THREE.Vector3(_x, _y, 0),
            rotation: new THREE.Euler(0, 0, _rotation),
            duplicated: true,
            mass: 0
        })
    }

    addInformationBuilding(_x, _y, _rotation = 0)
    {
        return this.objects.add({
            base: this.resources.items.informationStaticBase.scene,
            collision: this.resources.items.informationStaticCollision.scene,
            floorShadowTexture: this.resources.items.informationStaticFloorShadowTexture,
            offset: new THREE.Vector3(_x, _y, 0),
            rotation: new THREE.Euler(0, 0, _rotation),
            duplicated: true,
            mass: 0
        })
    }

    addBrickWall(_x, _y, _options = {})
    {
        return this.walls.add({
            object:
            {
                base: this.resources.items.brickBase.scene,
                collision: this.resources.items.brickCollision.scene,
                offset: new THREE.Vector3(0, 0, 0.1),
                rotation: new THREE.Euler(0, 0, _options.rotation ?? 0),
                duplicated: true,
                shadow: { sizeX: 1.2, sizeY: 1.8, offsetZ: -0.15, alpha: 0.35 },
                mass: _options.mass ?? 0.5,
                soundName: 'brick'
            },
            shape:
            {
                type: _options.type ?? 'brick',
                equilibrateLastLine: _options.equilibrateLastLine ?? true,
                widthCount: _options.widthCount ?? 5,
                heightCount: _options.heightCount ?? 2,
                position: new THREE.Vector3(_x, _y, 0),
                offsetWidth: _options.offsetWidth ?? new THREE.Vector3(1.05, 0, 0),
                offsetHeight: new THREE.Vector3(0, 0, 0.45),
                randomOffset: new THREE.Vector3(0, 0, 0),
                randomRotation: new THREE.Vector3(0, 0, _options.randomRotation ?? 0.2)
            }
        })
    }

    addBowlingPins(_x, _y, _count = 4)
    {
        return this.walls.add({
            object:
            {
                base: this.resources.items.bowlingPinBase.scene,
                collision: this.resources.items.bowlingPinCollision.scene,
                offset: new THREE.Vector3(0, 0, 0.1),
                rotation: new THREE.Euler(0, 0, 0),
                duplicated: true,
                shadow: { sizeX: 1.4, sizeY: 1.4, offsetZ: -0.15, alpha: 0.35 },
                mass: 0.1,
                soundName: 'bowlingPin'
            },
            shape:
            {
                type: 'triangle',
                widthCount: _count,
                position: new THREE.Vector3(_x, _y, 0),
                offsetWidth: new THREE.Vector3(0, 1, 0),
                offsetHeight: new THREE.Vector3(0.65, 0, 0),
                randomOffset: new THREE.Vector3(0, 0, 0),
                randomRotation: new THREE.Vector3(0, 0, 0)
            }
        })
    }

    addProp(_name, _x, _y, _rotation = 0, _mass = 1)
    {
        const sources = {
            ball: [this.resources.items.bowlingBallBase, this.resources.items.bowlingBallCollision, 'bowlingBall', Math.PI * 0.5],
            horn: [this.resources.items.hornBase, this.resources.items.hornCollision, 'horn', 0],
            lemon: [this.resources.items.lemonBase, this.resources.items.lemonCollision, 'brick', 0],
            baguette: [this.resources.items.informationBaguetteBase, this.resources.items.informationBaguetteCollision, 'brick', 0]
        }
        const source = sources[_name]

        return this.objects.add({
            base: source[0].scene,
            collision: source[1].scene,
            offset: new THREE.Vector3(_x, _y, 0.18),
            rotation: new THREE.Euler(source[3], 0, _rotation),
            duplicated: true,
            shadow: { sizeX: 1.4, sizeY: 1.4, offsetZ: -0.15, alpha: 0.35 },
            mass: _mass,
            soundName: source[2]
        })
    }

    setLibrary()
    {
        const x = this.library.x
        const y = this.library.y

        this.addProjectBoard(x, y, 0)
        this.addProjectBoard(x - 4.8, y - 3.4, Math.PI * 0.5)
        this.addProjectBoard(x + 4.8, y - 3.4, -Math.PI * 0.5)

        this.addBrickWall(x - 4.6, y + 1.7, {
            widthCount: 4,
            heightCount: 4,
            offsetWidth: new THREE.Vector3(0, 1.05, 0),
            randomRotation: 0.08
        })
        this.addBrickWall(x + 4.6, y + 1.7, {
            widthCount: 4,
            heightCount: 4,
            offsetWidth: new THREE.Vector3(0, -1.05, 0),
            randomRotation: 0.08
        })
        this.addBrickWall(x - 2.2, y - 5.2, {
            type: 'rectangle',
            widthCount: 3,
            heightCount: 2,
            randomRotation: 0.08
        })

        this.addProp('horn', x - 6.5, y - 2.2, 0.35, 0.4)
        this.addProp('horn', x + 6.5, y - 2.2, -0.35, 0.4)
        this.addProp('lemon', x, y - 5.4, 0, 0.6)

        this.makeLabel('library', x, y + 4.8, 3.8)
        this.makeArea('library', x, y, 7.5, 5)
        this.tiles.add({
            start: new THREE.Vector2(x - 8, y),
            delta: new THREE.Vector2(16, 0)
        })
    }

    setTrainingGround()
    {
        const x = this.trainingGround.x
        const y = this.trainingGround.y

        this.addBrickWall(x - 7.5, y + 7.2, {
            widthCount: 5,
            heightCount: 2,
            offsetWidth: new THREE.Vector3(0, 1.05, 0)
        })
        this.addBrickWall(x - 2.5, y + 4.2, {
            type: 'rectangle',
            widthCount: 5,
            heightCount: 3,
            offsetWidth: new THREE.Vector3(1.05, 0, 0),
            randomRotation: 0.15
        })
        this.addBrickWall(x + 6.5, y + 8.5, {
            type: 'triangle',
            widthCount: 6,
            heightCount: 4,
            offsetWidth: new THREE.Vector3(0, 1.05, 0),
            randomRotation: 0.16
        })
        this.addBowlingPins(x - 10, y + 0.5, 4)
        this.addProp('ball', x - 16, y + 0.5, 0, 1)
        this.addProp('horn', x - 12.5, y + 9, 0.2, 0.4)
        this.addProp('lemon', x + 4, y - 5.5, 0.3, 0.6)

        this.makeLabel('training-ground', x + 2, y + 8, 3.2)
        this.makeArea('training-ground', x + 1, y + 1, 10, 8)
    }

    setHome()
    {
        const x = this.home.x
        const y = this.home.y

        this.addInformationBuilding(x, y, 0)
        this.addInformationBuilding(x + 3.8, y - 3.5, -Math.PI * 0.5)

        this.objects.add({
            base: this.resources.items.informationBaguetteBase.scene,
            collision: this.resources.items.informationBaguetteCollision.scene,
            offset: new THREE.Vector3(x - 4.5, y + 5.3, 0.25),
            rotation: new THREE.Euler(0, 0, -0.6),
            duplicated: true,
            shadow: { sizeX: 0.6, sizeY: 3.5, offsetZ: -0.15, alpha: 0.35 },
            mass: 1.5
        })

        this.addBrickWall(x - 6.2, y - 2.5, {
            widthCount: 5,
            heightCount: 2,
            offsetWidth: new THREE.Vector3(0, 1.05, 0),
            randomRotation: 0.05
        })
        this.addBrickWall(x + 7.2, y - 2.5, {
            widthCount: 5,
            heightCount: 2,
            offsetWidth: new THREE.Vector3(0, 1.05, 0),
            randomRotation: 0.05
        })
        this.addBrickWall(x, y - 8.2, {
            widthCount: 7,
            heightCount: 2,
            offsetWidth: new THREE.Vector3(1.05, 0, 0),
            randomRotation: 0.05
        })
        this.addProp('horn', x - 2.8, y - 5.4, 0.15, 0.4)
        this.addProp('lemon', x - 7.2, y + 2.4, 0.4, 0.5)
        this.addProp('ball', x + 6.6, y + 2.4, 0, 0.7)
        this.addBowlingPins(x + 3.8, y - 7.2, 3)

        this.makeLabel('home', x + 2, y + 6, 3)
        this.makeArea('home', x + 2, y, 7, 7)
        this.tiles.add({
            start: new THREE.Vector2(x - 1.2, y + 13),
            delta: new THREE.Vector2(0, -20)
        })
    }
}
