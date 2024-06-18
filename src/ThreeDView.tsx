import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as OBC from '@thatopen/components';
// @ts-ignore
import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );

const ThreeDView: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const components = new OBC.Components();
            const worlds = components.get(OBC.Worlds);
            const world = worlds.create<
                OBC.SimpleScene,
                OBC.OrthoPerspectiveCamera,
                OBC.SimpleRenderer
            >();            

            world.scene = new OBC.SimpleScene(components);           
            world.renderer = new OBC.SimpleRenderer(components, container);
            world.camera = new OBC.OrthoPerspectiveCamera(components);

            components.init();

            world.scene.setup();            

            world.camera.controls.setLookAt(0, 500, 0, 0, 0, 0);
            
            //world.camera.projection.set("Orthographic");
            world.camera.three.updateProjectionMatrix();

            //const grids = components.get(OBC.Grids);
            //const grid = grids.create(world);

            const fragments = components.get(OBC.FragmentsManager);

            let uuid = "";

            async function loadFragments() {
              if (fragments.groups.size) {
                return;
              }
              const file = await fetch(
                "http://localhost:5173/Sample-Terrain.frag",
              );
              const data = await file.arrayBuffer();
              const buffer = new Uint8Array(data);
              const group = fragments.load(buffer);
              group.children.forEach((child) => {
                if (child.type == 'Mesh') {
                    (child as THREE.Mesh).material = [new THREE.MeshStandardMaterial({ color: '#008700', wireframe: true})];
                }
              })

              world.scene.three.add(group);
              uuid = group.uuid;
            }
            loadFragments();

            return () => {
              world.camera.dispose();  
              world.scene.dispose();
              components.dispose();
            };
        }
    }, []);

    return <div ref={containerRef} id="container" style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeDView;