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
        this.tiles = _options.tiles
        this.onAreaOpen = _options.onAreaOpen
        this.library = _options.library
        this.trainingGround = _options.trainingGround
        this.home = _options.home

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.setLibrary()
        this.setTrainingGround()
        this.setHome()
    }

    makeLabel(_area, _x, _y, _z = 2.4)
    {
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

    setLibrary()
    {
        this.objects.add({
            base: this.resources.items.projectsBoardStructure.scene,
            collision: this.resources.items.projectsBoardCollision.scene,
            floorShadowTexture: this.resources.items.projectsBoardStructureFloorShadowTexture,
            offset: new THREE.Vector3(this.library.x, this.library.y, 0),
            mass: 0
        })

        this.makeLabel('library', this.library.x, this.library.y + 4.8, 3.8)
        this.makeArea('library', this.library.x, this.library.y, 7.5, 5)
        this.tiles.add({
            start: new THREE.Vector2(this.library.x - 8, this.library.y),
            delta: new THREE.Vector2(16, 0)
        })
    }

    setTrainingGround()
    {
        this.makeLabel('training-ground', this.trainingGround.x + 2, this.trainingGround.y + 8, 3.2)
        this.makeArea('training-ground', this.trainingGround.x + 1, this.trainingGround.y + 1, 10, 8)
    }

    setHome()
    {
        this.objects.add({
            base: this.resources.items.informationStaticBase.scene,
            collision: this.resources.items.informationStaticCollision.scene,
            floorShadowTexture: this.resources.items.informationStaticFloorShadowTexture,
            offset: new THREE.Vector3(this.home.x, this.home.y, 0),
            mass: 0
        })

        this.objects.add({
            base: this.resources.items.informationBaguetteBase.scene,
            collision: this.resources.items.informationBaguetteCollision.scene,
            offset: new THREE.Vector3(this.home.x - 4.5, this.home.y + 5.3, 0.25),
            rotation: new THREE.Euler(0, 0, -0.6),
            duplicated: true,
            shadow: { sizeX: 0.6, sizeY: 3.5, offsetZ: -0.15, alpha: 0.35 },
            mass: 1.5
        })

        this.makeLabel('home', this.home.x + 2, this.home.y + 6, 3)
        this.makeArea('home', this.home.x + 2, this.home.y, 7, 7)
        this.tiles.add({
            start: new THREE.Vector2(this.home.x - 1.2, this.home.y + 13),
            delta: new THREE.Vector2(0, -20)
        })
    }
}
