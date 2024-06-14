import React, { Fragment, useEffect, useRef } from 'react';
import * as THREE from 'three';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as OBC from '@thatopen/components';
import * as OBCF from '@thatopen/fragments'; 
// @ts-ignore
import sampleLandXML from './assets/sample.xml';
//import * as xml2js from 'xml2js';
import { XMLParser } from 'fast-xml-parser';

const ThreeDView: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const components = new OBC.Components();
            const worlds = components.get(OBC.Worlds);
            const world = worlds.create<
                OBC.SimpleScene,
                OBC.SimpleCamera,
                OBC.SimpleRenderer
            >();            
            
            world.scene = new OBC.SimpleScene(components);
            world.renderer = new OBC.SimpleRenderer(components, container);
            world.camera = new OBC.SimpleCamera(components);

            components.init();

            console.log('LWTEST!');

            const scene = world.scene.three;
            world.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

            //const grid = new OBC.SimpleGrid(components);
            //scene.add(grid.get());

            const loadModel = async () => {
                try {                   
                    const response = await fetch(sampleLandXML);
                    console.log('HERE!');                    
                    if (!response.ok) {
                        console.error('Network response was not ok');
                        return;
                    }
                
                    const xmlString = await response.text();
                    const parser = new XMLParser();
                
                    let jsonObj;
                    try {
                        jsonObj = parser.parse(xmlString);
                    } catch (error) {
                        console.error('Failed to parse XML:', error);
                    }

                    //Extract points from the first surface in jsonObj
                    const points = jsonObj['LandXML']['Surfaces']['Surface']['Definition']['Pnts']['P'];

                    //Find the centroid of the points
                    let xSum = 0;
                    let ySum = 0;
                    let zSum = 0;
                    let minY = Infinity;
                    let maxY = -Infinity;
                    points.forEach((point: any) => {
                        let pts = point.split(' ');
                        const y = parseFloat(pts[2]);
                        xSum += parseFloat(pts[1]);
                        ySum += y;
                        zSum += parseFloat(pts[0]);
                        minY = Math.min(minY, y);
                        maxY = Math.max(maxY, y);
                    });
                    const range = maxY - minY;
                    const xCentroid = xSum / points.length;
                    const yCentroid = ySum / points.length;
                    const zCentroid = zSum / points.length;
                    console.log('Centroid:', xCentroid, yCentroid, zCentroid);
                    // Initialize array of points for BufferGeometry
                    let tempVertices: number[] = [];
                    points.forEach((point: any) => {
                        let pts = point.split(' ');
                        let x = parseFloat(pts[1]) - xCentroid;
                        let y = parseFloat(pts[2]) - yCentroid;
                        let z = parseFloat(pts[0]) - zCentroid;
                        tempVertices.push(x, y, z);
                    });

                    const faces = jsonObj['LandXML']['Surfaces']['Surface']['Definition']['Faces']['F'];
                    const facesArray: number[] = [];
                    faces.forEach((face: any) => {
                        const faceArray = face.split(' ');
                        facesArray.push(faceArray[0]-1, faceArray[1]-1, faceArray[2]-1);
                    });

                    const fragments = components.get(OBC.FragmentsManager);

                    // Create a BufferGeometry and set the vertices and indices
                    const geometry = new THREE.BufferGeometry();
                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(tempVertices, 3));
                    geometry.setIndex(facesArray);         

                    // Create a material and set the color
                    //const material = new THREE.MeshStandardMaterial({ color: '#FF0000', vertexColors: true});
                    
                    // Colorize the mesh according to height
                    let colors: number[] = [];
                    tempVertices.forEach((_, index) => {
                        const height = tempVertices[index * 3 + 2];
                        const normHeight = (height - (minY- yCentroid)) / range;
                        const r = normHeight + 0.5;
                        const g = normHeight + 0.5;
                        const color = new THREE.Color();
                        color.setRGB( r, g, 1, THREE.SRGBColorSpace );
                        colors.push(color.r, color.g, color.b);
                    });
                    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

                    const material = new THREE.MeshPhongMaterial( {
                        side: THREE.DoubleSide,
                        vertexColors: true,
                        wireframe: true
                    } );

                    // Create a mesh and add it to the scene
                    const mesh = new THREE.Mesh(geometry, material);

                    //fragments.meshes.push(mesh);   
                    //fragments.groups[0];     
                    
                    const frag = new OBCF.Fragment(geometry, material, 1);
                    const fragGroup = new OBCF.FragmentsGroup();
                    fragGroup.add()

                    scene.add(mesh);              
                } catch (error) {
                    console.error('Failed to load model:', error);
                }
            };
            loadModel();

            //const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
            //const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
            //const cube = new THREE.Mesh(boxGeometry, boxMaterial);
            //cube.position.set(0, 1.5, 0);
            //scene.add(cube);

            world.scene.setup();

            //const label = new OBC.Simple2DMarker(components);
            //label.get().position.set(0, 4, 0);
            //label.get().element.textContent = 'Hello, Components!';
            //label.get().element.addEventListener('pointerdown', () => {
            //console.log('Hello, Components!');
            //});            

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