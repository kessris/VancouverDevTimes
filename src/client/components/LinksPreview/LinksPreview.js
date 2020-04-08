import React from 'react';
import styles from './LinksPreview.css';

function LinksPreview({category, resources}) {

    return (
        <div className={styles.overall}>
            <h3 style={{color: 'black'}}>
                {category} (more...)
            </h3>
            <div className={styles.background}>
                {resources.map(resource =>
                    <span>
                        <li key={resource.title}><a href={resource.link} style={{color: "dodgerblue"}}>{text_truncate(resource.title)}</a></li>
                        ----------------------------------------------------------
                    </span>
                )}
            </div>

        </div>
    );
}

function text_truncate(string) {
    if (string.length <= 40)
        return string;
    else if (string.length > 40)
        return string.slice(0,40)+".....";
}

export default LinksPreview;