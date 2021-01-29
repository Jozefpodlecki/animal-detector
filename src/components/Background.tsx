import React, { CSSProperties, FunctionComponent, useEffect, useRef, useState } from "react";
import  { images, resizeImage } from "api";
import styles from "./background.scss";

type Props = {
    imageSrc: string;
}

const BackgroundTile: FunctionComponent<Props> = ({
    imageSrc,
}) => {
    const ref = useRef<HTMLDivElement>();
    const [style, setStyle] = useState<CSSProperties>({
        width: "0",
        height: "0",
        background: `url(${imageSrc}) center center / cover no-repeat`,
    });

    useEffect(() => {
        const {width, height} = ref.current.getBoundingClientRect();
        resizeImage(imageSrc, width, height)
            .then((pr) => {
                console.log(pr);
                setStyle(state => ({
                    ...state,
                    width: `${width}px`,
                    height: `${height}px`,
                    background: `url(${pr}) center center / cover no-repeat`,
                }))
            })
    }, [ref]);

    return <div ref={ref} style={style}/>;
}

const Background: FunctionComponent = () => {
    
    const vals = Object.values(images).slice(0, 6)

    return <div className={styles.background}>
        {vals.map(pr => <BackgroundTile key={pr} imageSrc={pr}/>)}
    </div>
}

export default Background;