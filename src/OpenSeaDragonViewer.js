import OpenSeaDragon, { parseJSON } from "openseadragon";
import * as Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';

import React, { useEffect, useState } from "react";

const OpenSeaDragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState( null);
  const [anno, setAnno] = useState(null)
  
useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
    }
    if (image && anno){
        InitAnnotations()
    }
  }, [image]);

const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    
    const initViewer = OpenSeaDragon({
        id: "openSeaDragon",
        prefixUrl: "openseadragon-images/",
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2
      })

    setViewer(initViewer );
    const config = {};
    const annotate = Annotorious(initViewer, config);
    setAnno(annotate)
  };

  const [annotations, setAnnotations] = useState([])

const InitAnnotations = async() => {

    const storedAnnoatations = getLocalAnnotations
    if (storedAnnoatations) {
        const annotations = parseJSON(storedAnnoatations)
        setAnnotations(annotations)
        anno.setAnnotations(annotations);

    }

    anno.on('createAnnotation', (annotation) => {
        const newAnnotations = [...annotations, annotation]
        setAnnotations(newAnnotations)
        setLocalAnnotation(newAnnotations)
      });

    anno.on('updateAnnotation', (annotation, previous) => {
        const newAnnotations = annotations.map(val => {
            if (val.id === annotation.id) return annotation
            return val
        })
        setAnnotations(newAnnotations)
        setLocalAnnotation(newAnnotations)
    });

    anno.on('deleteAnnotation', (annotation) => {
        const newAnnotations  = annotations.filter(val => val.id !== annotation.id)
        setAnnotations(newAnnotations)
        setLocalAnnotation(newAnnotations)
    });
}

const getLocalAnnotations =  () => {
    return localStorage.getItem(image.source.Image.Url) 
}

const setLocalAnnotation = (newAnnotations) => {
    localStorage.setItem(image.source.Image.Url, JSON.stringify(newAnnotations)) 
}

useEffect(() => {
    InitOpenseadragon();
    return () => {
        viewer && viewer.destroy();
    };
  }, []);
return (
  <div 
  id="openSeaDragon" 
  style={{
    height: "800px",
    width: "1200px"
  }}
  >
  </div>
  );
};
export { OpenSeaDragonViewer };