import React, { useState } from 'react';
import next from '../img/next.png';
import remove from '../img/delete.png';
import add from '../img/plus.png';
import closedFolder from '../img/folder.png';
import openFolder from '../img/open-folder.png';
import FolderModal from '../component/FolderModal';

const FolderManager = ({ item, setLoading, loading }) => {
    const { name, child, status } = item;
    const [showChild, setShowChild] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    return (
        <div>
            <div className='container'>
                <div
                    onClick={() => setShowChild(!showChild)}
                    className='folder'
                >
                    <img className='folderIcon' src={showChild && child?.length > 0 ? openFolder : closedFolder} alt="" />
                    <span
                        style={{ color: child?.length > 0 && showChild ? "tomato" : '' }}
                        className="folderName">

                        <span> {name}</span>
                    </span>
                    {child?.length > 0 &&
                        <span className='showBtn'>
                            <img className={showChild ? 'childShowed' : ''} src={next} alt="" />
                        </span>
                    }
                </div>
                {status !== "root" && child.length <= 0 &&
                    <img
                        onClick={() => { setIsDelete(true); setShowModal(true) }}
                        src={remove}
                        alt=""
                        className="deleteBtn"
                    />
                }
                <img
                    src={add}
                    alt=""
                    onClick={() => setShowModal(true)}
                    className="addBtn"
                />
                {showModal &&
                    <FolderModal
                        props={{ item, setShowModal, isDelete, setIsDelete, setLoading, loading }}
                    />}
            </div>
            <div style={{ marginLeft: 50 }}>
                {showChild && child.length > 0 && child?.map((item, index) => <FolderManager key={index} item={item} setLoading={setLoading} loading={loading} />)}
            </div>
        </div >
    )
}

export default FolderManager;