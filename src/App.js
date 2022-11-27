import React, { useEffect, useState } from 'react';
import './App.css';
import FolderManager from './component/FolderManager';

function App() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch('https://infinite-bastion-67292.herokuapp.com/structured-file')
      .then(res => res.json())
      .then(data => setData(data))
  }, [loading]);
  return (
    <div className='app'>
      <h1 className='title root_title' style={{ margin: "40px auto" }}>File Manager</h1>
      <div className="folderSection">
        {!data && <span>Loading...</span>}
        {data?.map((item, index) => (
          <FolderManager key={index} item={item} setLoading={setLoading} loading={loading} />
        ))}
      </div>
    </div>
  );
}

export default App;
