import {LayersModel, tensor4d} from '@tensorflow/tfjs';
import React, { ChangeEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import { faBug, faPaw, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NativeTypes } from 'react-dnd-html5-backend'
import  { get, getImageData, getRandomImage, getWebGlVersion, predictAnimalFromImage } from "api";
import styles from "./app.scss";
import Header from "components/Header";
import Footer from "components/Footer";
import { useDrop } from "react-dnd";
import Loader from "react-loader-spinner";
import Background from 'components/Background';

const App = () => {
    const fileRef = useRef<HTMLInputElement>();
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: [NativeTypes.FILE],
        drop(item, monitor) {
            const [file] = monitor.getItem().files
            console.log(file);
        },
        canDrop(item, monitor) {
            
            const files = (item as any).files as File[];
            const items = (item as any).items as DataTransferItemList;
            const allowedTypes = ["image/png", "image/jpg", "image/jfif", "image/webp"]
            

            if(files) {
                console.log(monitor.getItem());
                //const type = files[0].type;

                // if(allowedTypes.includes(type)) {
                //     return true;
                // }
            }

            return false;
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      })
    const [{
        isLoading,
        label,
        predictedAnimal,
        secondGuess,
        imageSrc,
        model
    }, setState] = useState<{
        isLoading: boolean;
        label: string;
        predictedAnimal: string;
        secondGuess: string;
        imageSrc: string;
        model: LayersModel;
    }>({
        isLoading: true,
        label: "Loading...",
        predictedAnimal: "",
        secondGuess: "",
        imageSrc: "",
        model: null
    });
    const [{
        webGlVersion,
        show,
    }, setStats] = useState({
        webGlVersion: 0,
        show: false,
    });

    useEffect(() => {

        const webGlVersion = getWebGlVersion();

        setStats(state => ({
            ...state,
            webGlVersion,
        }));
        // get(setState)
        //     .then(model => {
        //         setState(state => ({...state, model}));

        //         const imageSrc = getRandomImage();
        //         predictAnimalFromImage(model, imageSrc)
        //             .then(([predictedAnimal, secondGuess]) => {
        //                 setState(state => ({...state, 
        //                     imageSrc,
        //                     predictedAnimal,
        //                     secondGuess,
        //                 }));
        //             });
        //     })

    }, []);

    const onImageBrowse = () => {
        fileRef.current.click();
    }
  
    const onRandomImage = () => {
        const imageSrc = getRandomImage();

        predictAnimalFromImage(model, imageSrc)
            .then(([predictedAnimal, secondGuess]) => {
                setState(state => ({...state, 
                    imageSrc,
                    predictedAnimal,
                    secondGuess,
                }));
            });
    }

    const onToggleStats = () => {
        setStats(state => ({...state, show: !state.show}));
    }

    return <div className={styles.container}>
        <Header/>
        <Background/>
        {show ? <div className={styles.stats}>
            {webGlVersion ? <div>Webgl Version: {webGlVersion}</div> : <div>No webgl support</div>}
            <div onClick={onToggleStats} className={styles.statsClose}>
                <FontAwesomeIcon icon={faTimes} size="2x"/>
            </div>
        </div> : <div onClick={onToggleStats} className={styles.statsIcon}>
            <FontAwesomeIcon icon={faBug} size="2x"/>
        </div>}
        <div className={styles.content}>
            {isLoading ? <div className={styles.loader}>
                <Loader type="ThreeDots" color="#FFFFFF" height={80} width={80} />
                <div>
                    {label}
                </div>
            </div>
            : <div>
                <div ref={drop} className={styles.imageInput} onClick={onImageBrowse}>
                    {imageSrc ? <div className={styles.imageWrapper}>
                        <div className={styles.imageInputImage} style={{
                            backgroundImage: `url(${imageSrc})`
                        }}/>
                    </div>
                    : <div className={styles.placeholderWrapper}>
                        <div className={styles.inputPlaceholder}>
                            <div>Drag and drop or browse</div>
                            <div className={styles.imageInputIcon}>
                                <FontAwesomeIcon icon={faUpload} size="2x"/>
                            </div>
                        </div>
                    </div>}
                    <input className={styles.imageInputFile} ref={fileRef} type="file"/>
                </div>
                <div className={styles.predictionContent}>
                    <div>Prediction {predictedAnimal}</div>
                    <div>Second Guess {secondGuess}</div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={onRandomImage} variant="contained" color="primary">
                        Random Image
                    </Button>
                </div>
            </div>}
        </div>
        <Footer/>
    </div>
};

export default App;
