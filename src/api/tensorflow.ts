import * as tf from '@tensorflow/tfjs';

export const createModel = (imageHeight: number, imageWidth: number, classes: number): tf.LayersModel => {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
        inputShape: [imageHeight, imageWidth, 3],
        kernelSize: [3, 3],
        filters: 16,
        padding: "same",
        activation: 'relu'
    }));
    
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.conv2d({
        kernelSize: [3, 3],
        filters: 32,
        padding: "same",
        activation: 'relu'
    }));

    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.conv2d({
        kernelSize: [3, 3],
        filters: 64,
        padding: "same",
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));

    model.add(tf.layers.flatten({}));

    model.add(tf.layers.dense({
        units: 64,
        activation: 'relu'
    }));

    model.add(tf.layers.dense({
        units: classes,
    }));

    model.compile({
        optimizer: tf.train.adam(),
        loss: "categoricalCrossentropy",
        metrics: ['accuracy'],
    });

    return model;
}