import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as OBC from 'openbim-components';
import { toGlb } from "landxml";
import sampleLandXML from './assets/sample.xml';

const ThreeDView: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const components = new OBC.Components();
            components.scene = new OBC.SimpleScene(components);
            components.renderer = new OBC.SimpleRenderer(components, container);
            components.camera = new OBC.SimpleCamera(components);
            components.raycaster = new OBC.SimpleRaycaster(components);

            components.init();

            const scene = components.scene.get();
            (components.camera as any).controls.setLookAt(10, 10, 10, 0, 0, 0);

            const grid = new OBC.SimpleGrid(components);
            scene.add(grid.get());

            const loadModel = async () => {
                try {
                    // Read the contents of the sampleLandXML file into string
                    const response = await fetch(sampleLandXML);
                    const xmlString = await response.text();
                    
                    // Ensure sampleLandXML is correctly fetched or required
                    const center = "auto";
                    const glbSurfaces = await toGlb(xmlString, center);
                    let { glb } = glbSurfaces[0];

                    // Convert the Uint8Array to a Blob
                    const blob = new Blob([glb], { type: 'model/gltf-binary' });
                    // Create an object URL for the Blob
                    const url = URL.createObjectURL(blob);

                    const loader = new GLTFLoader();
                    loader.load(url, (gltf) => {
                        const model = gltf.scene;
                        scene.add(model);
                    }, undefined, (error) => {
                        console.error('An error happened', error);
                    });
                } catch (error) {
                    console.error('Failed to load model:', error);
                }
            };
            loadModel();

            const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
            const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
            const cube = new THREE.Mesh(boxGeometry, boxMaterial);
            cube.position.set(0, 1.5, 0);
            scene.add(cube);

            (components.scene as any).setup();

            const label = new OBC.Simple2DMarker(components);
            label.get().position.set(0, 4, 0);
            label.get().element.textContent = 'Hello, Components!';
            label.get().element.addEventListener('pointerdown', () => {
            console.log('Hello, Components!');
            });            

            return () => {
            (components.camera as any).dispose();  
            (components.scene as any).dispose();
            components.dispose();
            };
        }
    }, []);

    return <div ref={containerRef} id="container" style={{ width: '100%', height: '100vh' }} />;
};



export default ThreeDView;