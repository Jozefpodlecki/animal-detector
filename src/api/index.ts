import * as tf from '@tensorflow/tfjs';
import { mod, tensor, tensor4d } from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { createModel } from './tensorflow';

const importAssets = (context: __WebpackModuleApi.RequireContext, transform: (module: any) => any) => {
    const dict = context.keys()
        .reduce<Record<string, string>>((acc, key) => {
            const module = context(key);

            acc[key] = transform(module);

            return acc;
        }, {});

    return dict;
};

const imagesContext = require.context(
    "../assets/images/animals",
    false,
    /\.(webp|jfif|png|jpe?g|svg)$/,
    "sync"
);
export const images = importAssets(imagesContext, pr => pr.default);
const entries = Object.entries(images).slice(0, 4);

export const resizeImage = (url: string, width: number, height: number) => new Promise((resolve,) => {
    const image = new Image();
    image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height)
        const url = canvas.toDataURL("image/jpeg");
        resolve(url);
    }
    image.src = url;
});

export const getRandomImage = () => {
    const index = Math.floor(Math.random() * entries.length);

    return entries[index][1];
}

const animalMap = {
    "bear": 0,
    "camel": 1,
    "cheetah": 2,
    "elephant": 3,
    "hyena": 4,
    "sheep": 5,
    "giraffe": 6,
    "tiger": 7,
}

const imageWidth = 80;
const imageHeight = 60;

export const getImageData = (src: string) => new Promise<number[][][]>((resolve, reject) => {
    const image = new Image();
    
    image.onload = () => {

        const tensor = tf.browser
            .fromPixels(image)
            .resizeNearestNeighbor([imageHeight, imageWidth])
            .toFloat()
            .div<tf.Tensor3D>(tf.scalar(255.0))
            .array();

        resolve(tensor);
    };
    image.src = src;
});



export const get = async (dispatch: React.Dispatch<React.SetStateAction<{
    isLoading: boolean;
    label: string;
}>>): Promise<tf.LayersModel> => {

    const key = "localstorage://my-model-1";
    const serializedModel = localStorage.getItem("my-model-1");

    if(serializedModel) {
        const model = await tf.loadLayersModel(JSON.parse(serializedModel));
        
        return;
    }

    dispatch(state => ({...state, label: "Creating model..."}));

    const model = createModel(imageHeight, imageWidth, entries.length);
    
    dispatch(state => ({...state, label: "Processing images..."}));

    const regex = /\.\/(.*)-\d\..*/;
    const imageDatas: number[][][][] = [];
    const labels: string[] = [];
    let index = 1;

    for(const [key, value] of entries) {
        dispatch(state => ({...state, label: `Processing image ${index}...`}));

        const imageData = await getImageData(value);
        const label = regex.exec(key)[1];
        imageDatas.push(imageData);
        labels.push(label);
        index++;
    }

    dispatch(state => ({...state, label: `Creating dataset...`}));

    const dataset = tensor4d(imageDatas, [imageDatas.length, imageHeight, imageWidth, 3]);
    const labels_normalized = labels.map((pr: keyof typeof animalMap) => animalMap[pr]);
    
    const test = tf.oneHot(tf.tensor1d(labels_normalized, 'int32'), labels_normalized.length).toFloat()
    
    dispatch(state => ({...state, label: "Training model..."}));

    await model.fit(dataset, test, {
        epochs: 15,
        callbacks: {
            onEpochEnd(epoch, logs) {
                dispatch(state => ({...state, label: `Training model epoch ...${epoch}`}));
            }
        }
    })

    dispatch(state => ({...state, isLoading: false}));
    
    /*
    await model.save(key);

    */

    return model;
}

export const predictAnimalFromImage = async (model: tf.LayersModel, imageSrc: string) => {
    const imageData = await getImageData(imageSrc);
    const imageDatas = [imageData];

    const dataset = tensor4d(imageDatas, [imageDatas.length, imageHeight, imageWidth, 3]);
    const prediction = model.predict(dataset);
    if(Array.isArray(prediction)) {
        debugger;

        return ["test", "test"];
    }

    const result = await prediction.array() as number[][];

    const computed = result[0]
        .map((value, index) => ({
            index,
            value
        }))
        .sort((prev, next) => prev.value - next.value)

    const first = computed[0].index;
    const second = computed[1].index;
    const animalMapEntries = Object.entries(animalMap);
    const firstAnimal = animalMapEntries.find(([key, value]) => value === first);
    const secondAnimal = animalMapEntries.find(([key, value]) => value === second);

    return [firstAnimal[0], secondAnimal[0]];
}


function createCanvas() {
    if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(300, 150);
    }
    else if (typeof document !== 'undefined') {
        return document.createElement('canvas');
    }
    else {
        throw new Error('Cannot create a canvas in this context');
    }
}

export function getWebGlVersion() {
    
    let version = 0;
    const canvas = createCanvas();
    
    if(canvas.getContext('webgl2')) {
        return 2;
    }

    if(canvas.getContext('experimental-webgl')) {
        return 1;
    }
    
};
//# sourceMappingURL=canvas_util.js