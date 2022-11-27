import React from 'react';
import { toast } from 'react-toastify';

const FolderModal = ({ props }) => {
    const { item, setShowModal, isDelete, setIsDelete, setLoading, loading } = props;
    // console.log("setLoading", setLoading);
    // console.log("setIsDelete", setIsDelete);
    let data = {}
    const handleInput = (e) => {
        data = {
            ...data,
            [e.target.name]: e.target.value,
            parentId: item.id
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);
        setLoading(true);
        await fetch("https://infinite-bastion-67292.herokuapp.com/create", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    setLoading(false);
                    setShowModal(false);
                    toast.success(`${item.name} Added Successfully`, {
                        theme: 'colored'
                    })
                }
            })
    }
    const handleCancel = e => {
        e.preventDefault();
        setShowModal(false);
    }
    //delete
    const handleDelete = async (item) => {
        if (item.status === 'root') {
            window.alert('root cant delete')
        } else {
            setLoading(true);
            await fetch(`https://infinite-bastion-67292.herokuapp.com/delete/${item._id}`, {
                method: 'DELETE',
            })
                .then(res => res.json())
                .then(data => {
                    if (data.deletedCount > 0) {
                        setLoading(false);
                        setShowModal(false);
                        toast.success(`${item.name} Deleted Successfully`, {
                            theme: 'colored'
                        });
                    }
                })
        }
    }
    return (
        <div className='modal'>
            <div className='modalContainer'>
                {isDelete ?
                    <React.Fragment>
                        <h3 style={{ margin: "12px auto" }} className='title'>Want to DELETE {item.name} ?</h3>
                        <div style={{ marginBottom: '30px' }}>
                            <button onClick={handleCancel} className='actionBtn cancelDelete'>Cancel</button>
                            <button
                                type='submit'
                                className='actionBtn delete'
                                onClick={() => handleDelete(item)}
                            >
                                <span>Delete</span>
                            </button>
                        </div>
                        <span onClick={() => { setShowModal(false); setIsDelete(false) }} className='cross'>x</span>
                    </React.Fragment>
                    :
                    <form onSubmit={handleSubmit}>
                        <h3 style={{ margin: "12px auto" }} className='title'>Add Folder In {item.name}</h3>
                        <input
                            required
                            className='inputControl'
                            placeholder='Folder Name'
                            onBlur={handleInput}
                            type="text"
                            name="name"
                            id="" />
                        <div style={{ marginBottom: '30px' }}>
                            <button disabled={!loading && 'true'} onClick={handleCancel} className='actionBtn cancel'>Cancel</button>
                            <button disabled={loading && 'true'} type='submit' className='actionBtn create'><span>Create</span></button>
                        </div>
                        <span onClick={() => setShowModal(false)} className='cross'>x</span>
                    </form>
                }
            </div>
        </div >
    );
};

export default FolderModal;