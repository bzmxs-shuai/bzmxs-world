# Semantic Area Redesign Plan

Date: 2026-07-17
Branch: `feature/semantic-area-redesign`

## Current Problems

### Library

- The current area uses the original project-board structure and a text plane.
- Without the word `LIBRARY`, it reads as a generic sign/building, not a knowledge space.
- There is no visible book, shelf, reading table, code symbol, academic object, or ceremonial entrance.

### Home

- The current area uses the original information/static model plus a small prop.
- The surrounding space is sparse and does not communicate personal life, memories, travel, study, or daily habits.
- There is no porch, yard, warm window, furniture, photo wall, mailbox, or other lived-in detail.

### Training Ground

- The folio playground already provides driving ramps and pushable objects.
- It still reads more like a generic physics playground than an algorithm practice area.
- There is no explicit route, start/finish language, problem-board, or algorithm-themed obstacle grouping.

## Layout Sketches

### Library

```
              book wall / code board
       benches     open-book gateway     benches
                    wide entrance
             [public library facade]
        book stacks         reading table
                  driveway / tile path
```

Visual center: a large open book above/in front of the entrance, supported by a clearer public-building facade.

Recognition strategy:

- Public-building silhouette with columns, wide doorway, and raised roof.
- Giant open-book sculpture visible from the driving route.
- Exterior shelf wall with colored book spines.
- Reading courtyard with benches, a table, open books, and a blackboard with code symbols.

### Home

```
           memory wall / postcards
     fence     warm porch + chair/table       small tree
                  [cozy house]
        mailbox      stepping stones      flower beds
                     driveway path
```

Visual center: a warm lit porch and lived-in yard.

Recognition strategy:

- Sloped roof, chimney, glowing windows, porch canopy, and clear front door.
- Yard fence, mailbox, plants, stone path, porch furniture, backpack/shoes/camera/travel case.
- Photo wall and postcards for memory/life-blog context.

### Training Ground

```
   START arch -> numbered arrows -> stack / queue blocks
       sorting bars        graph nodes        jump ramp
                sliding-window frame
             challenge scoreboard / FINISH
```

Visual center: a start arch and challenge scoreboard framing the existing playground.

Recognition strategy:

- Keep original ramps, bricks, pins, and driving route.
- Add route arrows, numbered checkpoints, start/finish markers.
- Add algorithm devices: sorting bars, stack tower, queue blocks, graph nodes/edges, sliding-window frame, binary split sign.

## Implementation Boundaries

- Do not move or retune the vehicle, camera, physics, respawn, mobile controls, or article system.
- Do not expand the map.
- Keep existing fixed colliders. New semantic props are visual-only unless already part of folio objects.
- Use original folio resources plus original low-poly primitives built in code.
- No external assets are introduced in this pass.
