import React from "react";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./header.scss";

const Header = () => {

    return <header className={styles.header}>
        <div className={styles.logo}>
            <span>Animal</span>
            <span className={styles.icon}><FontAwesomeIcon icon={faPaw}/></span>
            <span>Detector</span>
        </div>
    </header>
}

export default Header;