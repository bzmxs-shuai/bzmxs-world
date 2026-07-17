import * as THREE from 'three'
import gsap from 'gsap'

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
        this.hideTextLabels = window.location.search.includes('hideLabels=1')
        this.materials = new Map()
        this.interactiveDetails = []

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

    getMaterial(_name, _color, _options = {})
    {
        const key = `${_name}-${_color}-${_options.opacity ?? 1}`
        if(this.materials.has(key))
        {
            return this.materials.get(key)
        }

        const material = new THREE.MeshBasicMaterial({
            color: _color,
            transparent: _options.opacity !== undefined && _options.opacity < 1,
            opacity: _options.opacity ?? 1,
            depthWrite: _options.depthWrite ?? true
        })
        material.name = _name
        this.materials.set(key, material)
        return material
    }

    addBox(_group, _name, _color, _size, _position, _rotation = new THREE.Euler())
    {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(_size.x, _size.y, _size.z),
            this.getMaterial(_name, _color)
        )
        mesh.position.copy(_position)
        mesh.rotation.copy(_rotation)
        _group.add(mesh)
        return mesh
    }

    addCylinder(_group, _name, _color, _radius, _height, _position, _segments = 6)
    {
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(_radius, _radius, _height, _segments),
            this.getMaterial(_name, _color)
        )
        mesh.rotation.x = Math.PI * 0.5
        mesh.position.copy(_position)
        _group.add(mesh)
        return mesh
    }

    addConeTree(_group, _x, _y, _scale = 1)
    {
        this.addCylinder(_group, 'semanticWood', '#8d5b30', 0.16 * _scale, 0.8 * _scale, new THREE.Vector3(_x, _y, 0.4 * _scale), 6)

        const crown = new THREE.Mesh(
            new THREE.ConeGeometry(0.78 * _scale, 1.55 * _scale, 5),
            this.getMaterial('semanticLeaf', '#b7d665')
        )
        crown.position.set(_x, _y, 1.45 * _scale)
        crown.rotation.x = Math.PI * 0.5
        crown.rotation.z = Math.PI * 0.2
        _group.add(crown)
        return crown
    }

    addCanvasPlane(_group, _lines, _options)
    {
        if(this.hideTextLabels && _options.hideWithLabels)
        {
            return null
        }

        const canvas = document.createElement('canvas')
        canvas.width = _options.width ?? 512
        canvas.height = _options.height ?? 256
        const context = canvas.getContext('2d')
        context.fillStyle = _options.background ?? 'rgba(42, 31, 22, 0.88)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.strokeStyle = _options.border ?? '#f0cf88'
        context.lineWidth = _options.borderWidth ?? 10
        context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24)
        context.textAlign = _options.align ?? 'center'

        _lines.forEach((line, index) =>
        {
            context.fillStyle = line.color ?? '#fff6d9'
            context.font = line.font ?? '700 42px Arial'
            context.fillText(line.text, canvas.width / 2, line.y ?? 70 + index * 52)
        })

        const texture = new THREE.CanvasTexture(canvas)
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.LinearFilter

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(_options.size.x, _options.size.y),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
        )
        mesh.position.copy(_options.position)
        mesh.rotation.copy(_options.rotation ?? new THREE.Euler(Math.PI * 0.5, 0, 0))
        _group.add(mesh)
        return mesh
    }

    addOpenBook(_group, _x, _y, _z, _scale = 1)
    {
        const book = new THREE.Group()
        book.position.set(_x, _y, _z)

        const coverLeft = this.addBox(book, 'bookCover', '#7d4b2f', new THREE.Vector3(2.25 * _scale, 1.6 * _scale, 0.16 * _scale), new THREE.Vector3(-0.95 * _scale, 0, 0), new THREE.Euler(0, -0.32, 0.08))
        const coverRight = this.addBox(book, 'bookCover', '#7d4b2f', new THREE.Vector3(2.25 * _scale, 1.6 * _scale, 0.16 * _scale), new THREE.Vector3(0.95 * _scale, 0, 0), new THREE.Euler(0, 0.32, -0.08))
        const pageLeft = this.addBox(book, 'bookPage', '#fff2c8', new THREE.Vector3(2.05 * _scale, 1.45 * _scale, 0.11 * _scale), new THREE.Vector3(-0.92 * _scale, 0, 0.08 * _scale), coverLeft.rotation)
        const pageRight = this.addBox(book, 'bookPage', '#ffe7b2', new THREE.Vector3(2.05 * _scale, 1.45 * _scale, 0.11 * _scale), new THREE.Vector3(0.92 * _scale, 0, 0.08 * _scale), coverRight.rotation)
        this.addBox(book, 'bookSpine', '#5a3323', new THREE.Vector3(0.22 * _scale, 1.7 * _scale, 0.24 * _scale), new THREE.Vector3(0, 0, -0.02 * _scale))

        const codeMat = this.getMaterial('bookCode', '#725a38')
        for(let i = 0; i < 5; i++)
        {
            const leftLine = new THREE.Mesh(new THREE.BoxGeometry(0.75 * _scale, 0.035 * _scale, 0.035 * _scale), codeMat)
            leftLine.position.set(-1.05 * _scale, (-0.42 + i * 0.2) * _scale, 0.22 * _scale)
            leftLine.rotation.copy(pageLeft.rotation)
            book.add(leftLine)

            const rightLine = new THREE.Mesh(new THREE.BoxGeometry((0.35 + i * 0.12) * _scale, 0.035 * _scale, 0.035 * _scale), codeMat)
            rightLine.position.set(1.0 * _scale, (-0.4 + i * 0.2) * _scale, 0.22 * _scale)
            rightLine.rotation.copy(pageRight.rotation)
            book.add(rightLine)
        }

        _group.add(book)
        return book
    }

    addBench(_group, _x, _y, _rotation = 0)
    {
        const bench = new THREE.Group()
        bench.position.set(_x, _y, 0)
        bench.rotation.z = _rotation
        this.addBox(bench, 'benchWood', '#9d6b38', new THREE.Vector3(1.8, 0.28, 0.16), new THREE.Vector3(0, 0, 0.56))
        this.addBox(bench, 'benchBack', '#8a582d', new THREE.Vector3(1.8, 0.16, 0.65), new THREE.Vector3(0, 0.18, 0.92), new THREE.Euler(0.18, 0, 0))
        this.addBox(bench, 'benchLeg', '#654022', new THREE.Vector3(0.16, 0.16, 0.5), new THREE.Vector3(-0.66, -0.05, 0.25))
        this.addBox(bench, 'benchLeg', '#654022', new THREE.Vector3(0.16, 0.16, 0.5), new THREE.Vector3(0.66, -0.05, 0.25))
        _group.add(bench)
        return bench
    }

    addRouteArrow(_group, _x, _y, _rotation, _color = '#ffe58e')
    {
        const arrow = new THREE.Group()
        arrow.position.set(_x, _y, 0.05)
        arrow.rotation.z = _rotation
        this.addBox(arrow, 'routeArrow', _color, new THREE.Vector3(1.15, 0.28, 0.06), new THREE.Vector3(-0.18, 0, 0))
        const head = new THREE.Mesh(
            new THREE.ConeGeometry(0.34, 0.62, 3),
            this.getMaterial('routeArrowHead', _color)
        )
        head.rotation.z = -Math.PI * 0.5
        head.rotation.x = Math.PI * 0.5
        head.position.set(0.6, 0, 0)
        arrow.add(head)
        _group.add(arrow)
        return arrow
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
        const libraryGroup = new THREE.Group()
        libraryGroup.name = 'SemanticLibrary'
        this.container.add(libraryGroup)

        this.objects.add({
            base: this.resources.items.projectsBoardStructure.scene,
            collision: this.resources.items.projectsBoardCollision.scene,
            floorShadowTexture: this.resources.items.projectsBoardStructureFloorShadowTexture,
            offset: new THREE.Vector3(this.library.x, this.library.y, 0),
            mass: 0
        })

        const x = this.library.x
        const y = this.library.y

        // Public-building silhouette, facade and ceremonial entrance
        this.addBox(libraryGroup, 'libraryStone', '#d8c49a', new THREE.Vector3(7.7, 1.15, 3.1), new THREE.Vector3(x, y - 1.55, 1.55))
        this.addBox(libraryGroup, 'libraryRoof', '#8e5e3d', new THREE.Vector3(8.3, 1.55, 0.55), new THREE.Vector3(x, y - 1.55, 3.38))
        this.addBox(libraryGroup, 'libraryDoor', '#4b3325', new THREE.Vector3(1.45, 0.22, 1.65), new THREE.Vector3(x, y - 2.18, 0.95))
        this.addBox(libraryGroup, 'librarySteps', '#eee0bd', new THREE.Vector3(3.7, 1.0, 0.18), new THREE.Vector3(x, y - 3.0, 0.09))
        this.addBox(libraryGroup, 'librarySteps', '#d6be8f', new THREE.Vector3(4.4, 0.65, 0.12), new THREE.Vector3(x, y - 3.6, 0.06))

        for(const columnX of [-3.05, -1.72, 1.72, 3.05])
        {
            this.addCylinder(libraryGroup, 'libraryColumn', '#f1dfb6', 0.16, 2.65, new THREE.Vector3(x + columnX, y - 2.2, 1.35), 8)
        }

        const windowMat = this.getMaterial('libraryWindow', '#9ed8d0')
        const warmWindowMat = this.getMaterial('libraryWindowActive', '#ffe7a3')
        const windows = []
        for(const wx of [-2.65, -0.95, 0.95, 2.65])
        {
            const window = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.08, 0.85), windowMat.clone())
            window.position.set(x + wx, y - 2.24, 2.05)
            libraryGroup.add(window)
            windows.push(window)
        }

        // Giant open-book sculpture as the library visual center
        const book = this.addOpenBook(libraryGroup, x, y - 3.78, 1.28, 1.25)
        book.rotation.z = 0
        this.addCanvasPlane(libraryGroup, [
            { text: '</>  { }  AI', y: 84, font: '700 56px Arial', color: '#3e3222' },
            { text: 'C++  DATA  ROBOTICS', y: 148, font: '700 30px Arial', color: '#7b5e31' }
        ], {
            size: new THREE.Vector2(2.9, 1.1),
            position: new THREE.Vector3(x, y - 3.78, 2.12),
            background: 'rgba(255, 242, 203, 0.92)',
            border: '#7d4b2f'
        })

        // Exterior shelves and knowledge wall
        for(let shelf = 0; shelf < 3; shelf++)
        {
            this.addBox(libraryGroup, 'shelfWood', '#7b4a2a', new THREE.Vector3(2.2, 0.18, 0.12), new THREE.Vector3(x - 4.8, y - 0.9, 0.7 + shelf * 0.48))
            for(let i = 0; i < 8; i++)
            {
                const colors = ['#e46d4c', '#f2c66d', '#5e9f8d', '#6e88c7', '#e9e1c2']
                this.addBox(libraryGroup, 'bookSpine', colors[(i + shelf) % colors.length], new THREE.Vector3(0.16, 0.22, 0.35 + (i % 3) * 0.06), new THREE.Vector3(x - 5.75 + i * 0.25, y - 1.03, 0.93 + shelf * 0.48))
            }
        }

        this.addCanvasPlane(libraryGroup, [
            { text: 'if (learn) {', y: 70, font: '700 42px Arial', color: '#dff2d3' },
            { text: '  build();', y: 124, font: '700 42px Arial', color: '#fff4b6' },
            { text: '}', y: 178, font: '700 42px Arial', color: '#dff2d3' }
        ], {
            size: new THREE.Vector2(2.7, 1.65),
            position: new THREE.Vector3(x + 4.65, y - 1.0, 1.35),
            background: 'rgba(28, 48, 38, 0.95)',
            border: '#bdd6a2'
        })

        // Reading courtyard
        this.addBench(libraryGroup, x - 3.0, y + 1.6, -0.2)
        this.addBench(libraryGroup, x + 3.0, y + 1.6, 0.2)
        this.addBox(libraryGroup, 'readingTable', '#8e6435', new THREE.Vector3(1.4, 0.9, 0.18), new THREE.Vector3(x, y + 1.75, 0.72))
        this.addBox(libraryGroup, 'readingTableLeg', '#5c3d22', new THREE.Vector3(0.14, 0.14, 0.65), new THREE.Vector3(x - 0.48, y + 1.48, 0.34))
        this.addBox(libraryGroup, 'readingTableLeg', '#5c3d22', new THREE.Vector3(0.14, 0.14, 0.65), new THREE.Vector3(x + 0.48, y + 2.02, 0.34))
        this.addOpenBook(libraryGroup, x, y + 1.75, 0.92, 0.28)
        this.addConeTree(libraryGroup, x - 5.2, y + 2.2, 0.75)
        this.addConeTree(libraryGroup, x + 5.2, y + 2.2, 0.75)

        const libraryArea = this.makeArea('library', this.library.x, this.library.y, 7.5, 5)
        libraryArea.on('in', () =>
        {
            gsap.to(book.rotation, { y: 0.12, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' })
            for(const window of windows)
            {
                window.material = warmWindowMat
            }
        })
        libraryArea.on('out', () =>
        {
            for(const window of windows)
            {
                window.material = windowMat
            }
        })

        this.makeLabel('library', this.library.x, this.library.y + 4.8, 3.8)
        this.tiles.add({
            start: new THREE.Vector2(this.library.x - 8, this.library.y),
            delta: new THREE.Vector2(16, 0)
        })
    }

    setTrainingGround()
    {
        const trainingGroup = new THREE.Group()
        trainingGroup.name = 'SemanticTrainingGround'
        this.container.add(trainingGroup)

        const x = this.trainingGround.x
        const y = this.trainingGround.y

        // Start gate and route language
        this.addBox(trainingGroup, 'trainingMetal', '#5f6f73', new THREE.Vector3(0.35, 0.35, 2.4), new THREE.Vector3(x - 4.5, y + 11.2, 1.2))
        this.addBox(trainingGroup, 'trainingMetal', '#5f6f73', new THREE.Vector3(0.35, 0.35, 2.4), new THREE.Vector3(x + 4.5, y + 11.2, 1.2))
        this.addBox(trainingGroup, 'trainingArch', '#f4b045', new THREE.Vector3(9.4, 0.35, 0.42), new THREE.Vector3(x, y + 11.2, 2.42))
        this.addCanvasPlane(trainingGroup, [
            { text: 'START', y: 92, font: '700 72px Arial', color: '#1f2528' },
            { text: 'ALGORITHM ROUTE', y: 152, font: '700 34px Arial', color: '#365057' }
        ], {
            size: new THREE.Vector2(4.6, 1.55),
            position: new THREE.Vector3(x, y + 11.0, 2.85),
            background: 'rgba(255, 185, 72, 0.9)',
            border: '#1f2528',
            hideWithLabels: true
        })

        const arrowPoints = [
            [x - 2.6, y + 8.5, -Math.PI * 0.5],
            [x - 1.2, y + 5.9, -Math.PI * 0.35],
            [x + 1.5, y + 3.6, -Math.PI * 0.2],
            [x + 5.6, y + 2.6, 0],
            [x + 8.8, y + 4.0, Math.PI * 0.2]
        ]
        for(const point of arrowPoints)
        {
            this.addRouteArrow(trainingGroup, point[0], point[1], point[2], '#ffd166')
        }

        // Algorithm objects
        for(let i = 0; i < 6; i++)
        {
            this.addBox(trainingGroup, 'sortingBar', ['#f55c47', '#f59f45', '#f5d547', '#8acb62', '#4aa7a1', '#5271c4'][i], new THREE.Vector3(0.45, 0.45, 0.45 + i * 0.22), new THREE.Vector3(x - 8 + i * 0.7, y + 5.7, 0.225 + i * 0.11))
        }

        for(let i = 0; i < 5; i++)
        {
            this.addBox(trainingGroup, 'queueBlock', '#dce8ef', new THREE.Vector3(0.55, 0.55, 0.42), new THREE.Vector3(x - 9.0 + i * 0.7, y + 1.5, 0.21))
        }

        for(let i = 0; i < 4; i++)
        {
            this.addBox(trainingGroup, 'stackBlock', '#e9c46a', new THREE.Vector3(0.65, 0.65, 0.32), new THREE.Vector3(x - 10.8, y - 2.1, 0.16 + i * 0.34))
        }

        const nodePositions = [
            [x + 6.5, y + 8.2],
            [x + 8.2, y + 6.6],
            [x + 5.8, y + 5.7],
            [x + 9.4, y + 4.8],
            [x + 7.0, y + 3.6]
        ]
        for(let i = 0; i < nodePositions.length; i++)
        {
            this.addCylinder(trainingGroup, 'graphNode', '#8ecae6', 0.34, 0.2, new THREE.Vector3(nodePositions[i][0], nodePositions[i][1], 0.2), 12)
        }
        const graphEdges = [[0, 1], [0, 2], [1, 3], [2, 4], [4, 3]]
        for(const edge of graphEdges)
        {
            const a = new THREE.Vector2(...nodePositions[edge[0]])
            const b = new THREE.Vector2(...nodePositions[edge[1]])
            const mid = a.clone().add(b).multiplyScalar(0.5)
            const length = a.distanceTo(b)
            const angle = Math.atan2(b.y - a.y, b.x - a.x)
            this.addBox(trainingGroup, 'graphEdge', '#cde8ef', new THREE.Vector3(length, 0.08, 0.08), new THREE.Vector3(mid.x, mid.y, 0.16), new THREE.Euler(0, 0, angle))
        }

        this.addBox(trainingGroup, 'slidingWindow', '#68b0ab', new THREE.Vector3(2.4, 0.16, 1.1), new THREE.Vector3(x + 10.5, y - 1.2, 0.75))
        this.addBox(trainingGroup, 'slidingWindow', '#68b0ab', new THREE.Vector3(0.16, 1.4, 1.1), new THREE.Vector3(x + 9.4, y - 1.2, 0.75))
        this.addBox(trainingGroup, 'slidingWindow', '#68b0ab', new THREE.Vector3(0.16, 1.4, 1.1), new THREE.Vector3(x + 11.6, y - 1.2, 0.75))

        this.addCanvasPlane(trainingGroup, [
            { text: 'TRAINING GROUND', y: 68, font: '700 44px Arial', color: '#fff5d2' },
            { text: 'Completed Problems: 2', y: 124, font: '700 32px Arial', color: '#ffcf75' },
            { text: 'Current: Sliding Window', y: 176, font: '700 30px Arial', color: '#aee8df' }
        ], {
            size: new THREE.Vector2(5.8, 2.2),
            position: new THREE.Vector3(x + 10.2, y + 9.1, 2.15),
            background: 'rgba(35, 43, 43, 0.92)',
            border: '#ffb84d',
            hideWithLabels: true
        })

        this.makeLabel('training-ground', this.trainingGround.x + 2, this.trainingGround.y + 8, 3.2)
        this.makeArea('training-ground', this.trainingGround.x + 1, this.trainingGround.y + 1, 10, 8)
    }

    setHome()
    {
        const homeGroup = new THREE.Group()
        homeGroup.name = 'SemanticHome'
        this.container.add(homeGroup)

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

        const x = this.home.x
        const y = this.home.y

        // Cozy house shell and porch
        this.addBox(homeGroup, 'homeWood', '#bd7c48', new THREE.Vector3(4.9, 3.4, 2.25), new THREE.Vector3(x + 0.3, y - 0.2, 1.12))
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(3.95, 2.1, 4),
            this.getMaterial('homeRoof', '#8c4938')
        )
        roof.position.set(x + 0.3, y - 0.2, 3.0)
        roof.rotation.x = Math.PI * 0.5
        roof.rotation.z = Math.PI * 0.25
        homeGroup.add(roof)
        this.addBox(homeGroup, 'homeDoor', '#5b3326', new THREE.Vector3(0.82, 0.16, 1.35), new THREE.Vector3(x - 0.75, y - 1.98, 0.8))
        this.addBox(homeGroup, 'porchFloor', '#9d6940', new THREE.Vector3(3.25, 1.2, 0.18), new THREE.Vector3(x - 0.1, y - 2.55, 0.16))
        this.addBox(homeGroup, 'porchRoof', '#7b4434', new THREE.Vector3(3.4, 1.15, 0.22), new THREE.Vector3(x - 0.1, y - 2.55, 2.05))
        this.addCylinder(homeGroup, 'porchPost', '#6b4228', 0.11, 1.8, new THREE.Vector3(x - 1.55, y - 2.95, 1.05), 6)
        this.addCylinder(homeGroup, 'porchPost', '#6b4228', 0.11, 1.8, new THREE.Vector3(x + 1.35, y - 2.95, 1.05), 6)
        this.addBox(homeGroup, 'chimney', '#7d4b39', new THREE.Vector3(0.55, 0.55, 1.25), new THREE.Vector3(x + 1.85, y - 0.35, 3.55))

        const windowMat = this.getMaterial('homeWindow', '#ffd88c')
        const brightWindowMat = this.getMaterial('homeWindowBright', '#fff1aa')
        const homeWindows = []
        for(const wx of [-1.5, 1.45])
        {
            const window = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 0.72), windowMat.clone())
            window.position.set(x + wx, y - 2.02, 1.45)
            homeGroup.add(window)
            homeWindows.push(window)
        }

        // Yard and lived-in details
        for(const fx of [-3.1, -1.9, -0.7, 0.5, 1.7, 2.9])
        {
            this.addBox(homeGroup, 'yardFence', '#e0b06f', new THREE.Vector3(0.18, 0.18, 0.65), new THREE.Vector3(x + fx, y - 5.15, 0.33))
        }
        this.addBox(homeGroup, 'yardFenceRail', '#d09b5c', new THREE.Vector3(6.4, 0.12, 0.16), new THREE.Vector3(x - 0.1, y - 5.15, 0.58))
        this.addBox(homeGroup, 'yardFenceRail', '#d09b5c', new THREE.Vector3(6.4, 0.12, 0.16), new THREE.Vector3(x - 0.1, y - 5.15, 0.28))
        for(let i = 0; i < 6; i++)
        {
            this.addBox(homeGroup, 'steppingStone', '#ead7b5', new THREE.Vector3(0.72, 0.5, 0.08), new THREE.Vector3(x - 0.4 + i * 0.18, y - 4.55 + i * 0.45, 0.04), new THREE.Euler(0, 0, (i % 2 ? 0.2 : -0.12)))
        }
        this.addConeTree(homeGroup, x + 4.0, y - 3.8, 0.9)
        this.addConeTree(homeGroup, x - 4.2, y - 1.2, 0.75)

        this.addBench(homeGroup, x + 1.55, y - 3.25, -0.35)
        this.addBox(homeGroup, 'porchTable', '#85552f', new THREE.Vector3(0.65, 0.55, 0.14), new THREE.Vector3(x - 1.55, y - 3.15, 0.72))
        this.addCylinder(homeGroup, 'coffeeCup', '#fff4d0', 0.12, 0.18, new THREE.Vector3(x - 1.42, y - 3.15, 0.88), 10)
        this.addOpenBook(homeGroup, x - 1.7, y - 3.15, 0.9, 0.18)
        this.addBox(homeGroup, 'backpack', '#48636f', new THREE.Vector3(0.45, 0.3, 0.55), new THREE.Vector3(x + 1.2, y - 3.65, 0.34), new THREE.Euler(0, 0, 0.3))
        this.addBox(homeGroup, 'travelCase', '#c98d57', new THREE.Vector3(0.65, 0.35, 0.48), new THREE.Vector3(x - 2.45, y - 3.7, 0.28), new THREE.Euler(0, 0, -0.2))
        this.addCylinder(homeGroup, 'cameraLens', '#273238', 0.12, 0.14, new THREE.Vector3(x - 2.45, y - 3.95, 0.6), 12)

        for(let i = 0; i < 5; i++)
        {
            this.addCylinder(homeGroup, 'flowerStem', '#729c56', 0.035, 0.28, new THREE.Vector3(x + 3.0 + i * 0.28, y - 4.6 + (i % 2) * 0.22, 0.18), 5)
            const bloom = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), this.getMaterial('flowerBloom', ['#ff9a8a', '#ffd166', '#f28482'][i % 3]))
            bloom.position.set(x + 3.0 + i * 0.28, y - 4.6 + (i % 2) * 0.22, 0.36)
            homeGroup.add(bloom)
        }

        this.addBox(homeGroup, 'mailboxPost', '#7a5637', new THREE.Vector3(0.14, 0.14, 0.8), new THREE.Vector3(x - 3.35, y - 4.65, 0.4))
        this.addBox(homeGroup, 'mailbox', '#e05d45', new THREE.Vector3(0.75, 0.42, 0.36), new THREE.Vector3(x - 3.35, y - 4.65, 0.9))

        this.addCanvasPlane(homeGroup, [
            { text: '2024', y: 58, font: '700 34px Arial', color: '#5e432d' },
            { text: 'TRAVEL', y: 112, font: '700 42px Arial', color: '#8c5a38' },
            { text: 'NOTES', y: 166, font: '700 42px Arial', color: '#8c5a38' }
        ], {
            size: new THREE.Vector2(2.2, 1.6),
            position: new THREE.Vector3(x + 3.05, y - 1.9, 1.35),
            background: 'rgba(255, 232, 186, 0.94)',
            border: '#bd7c48',
            hideWithLabels: true
        })

        const porchLamp = this.addCylinder(homeGroup, 'porchLamp', '#ffd37a', 0.18, 0.16, new THREE.Vector3(x - 0.05, y - 2.98, 1.82), 12)
        const homeArea = this.makeArea('home', this.home.x + 2, this.home.y, 7, 7)
        homeArea.on('in', () =>
        {
            gsap.to(porchLamp.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.35 })
            for(const window of homeWindows)
            {
                window.material = brightWindowMat
            }
        })
        homeArea.on('out', () =>
        {
            gsap.to(porchLamp.scale, { x: 1, y: 1, z: 1, duration: 0.35 })
            for(const window of homeWindows)
            {
                window.material = windowMat
            }
        })

        this.makeLabel('home', this.home.x + 2, this.home.y + 6, 3)
        this.tiles.add({
            start: new THREE.Vector2(this.home.x - 1.2, this.home.y + 13),
            delta: new THREE.Vector2(0, -20)
        })
    }
}
