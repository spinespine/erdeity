/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import './App.css'
import uploadIcon from './assets/upload.webp'
import x from './assets/x.png'
import check from './assets/check.png'
import plus from './assets/plus.png'
import up from './assets/up.png'
import pencil from './assets/pencil.png'

class tab {
  constructor () {
    this.erds = new Array()
    this.title = "New Tab"
  }
}

function App() {
  const [data, setData] = useState(0)
  const [filename, setFilename] = useState("")
  const [tabs, setTabs] = useState([ new tab() ])
  const [currentTab, setCurrentTab] = useState(0)

  const handleUpload = () => {
    const file = document.getElementById('fileInput').files[0]
    setFilename(file.name)
    
    console.log(file)

    if (file) {
      const reader = new FileReader()

      reader.onload = function (e) {
        const content = e.target.result;
        const parsedData = JSON.parse(content);
  
        console.log(parsedData)

        if (file.name.split('.')[1] == 'erdeity') {
          setData(parsedData.list)
          setTabs(parsedData.gui)
        }
        else setData(parsedData)
      }

      reader.readAsText(file)
      document.getElementById('labelContainer').style.display = 'none'
    }
  }

  const addERD = (erd) => {
    for (const tabERD of tabs[currentTab].erds)
    if (erd.id == tabERD.id) return

    erd.interval = 1000
    const updatedTabs = [...tabs]
    updatedTabs[currentTab].erds.push(erd)
    setTabs(updatedTabs)
  }
  const removeERD = (erd) => {
    const updatedTabs = [...tabs]
    updatedTabs[currentTab].erds.splice( updatedTabs[currentTab].erds.indexOf(erd), 1 )
    setTabs(updatedTabs)
  }
  const newTab = () => {
    const updatedTabs = [...tabs]
    updatedTabs.push(new tab())
    setTabs(updatedTabs)
    switchToTab(updatedTabs.length - 1)
  }
  const nameTab = (reset) => {
    const updatedTabs = [...tabs]
    const input = document.getElementById('tabNamer').value
    setTimeout( () => {
      if (input == document.getElementById('tabNamer').value) 
      updatedTabs[currentTab].title = reset == true ? 'Tab ' + (currentTab + 1) : input
      setTabs(updatedTabs)
    }, 100 )
  }

  const switchToTab = (tab) => {
    if (document.getElementById('tabNamer').value == '') {
      document.getElementById('tabNamer').value = 'Tab ' + (data.currentTab + 1)
      const updatedTabs = [...tabs]
      updatedTabs[currentTab].title = 'Tab ' + (currentTab + 1)
      setTabs(updatedTabs)
    }
    setCurrentTab(tab)
  }
  const closeTab = (tab) => {
    const updatedTabs = [...tabs]
    if (updatedTabs.length == 1) {
      updatedTabs[0].erds = []
      updatedTabs[0].title = "New Tab"
    }
    else updatedTabs.splice( tab, 1 )
    setTabs(updatedTabs)
  }

  const move = (index, direction) => {
    const updatedTabs = [...tabs]
    if (direction == 'up') {
      if (index == 0) return
      const temp = updatedTabs[currentTab].erds[index]
      updatedTabs[currentTab].erds[index] = updatedTabs[currentTab].erds[index - 1]
      updatedTabs[currentTab].erds[index - 1] = temp
    }
    if (direction == 'down') {
      if (index == updatedTabs[currentTab].erds.length - 1) return
      const temp = updatedTabs[currentTab].erds[index]
      updatedTabs[currentTab].erds[index] = updatedTabs[currentTab].erds[index + 1]
      updatedTabs[currentTab].erds[index + 1] = temp
    }
    setTabs(updatedTabs)
  }

  const funcs = {
    addERD: addERD,
    removeERD: removeERD,
    switchToTab: switchToTab,
    newTab: newTab,
    nameTab: nameTab,
    closeTab: closeTab,
    move: move
  }
  const ERDdata = {
    namespace: data.namespace,
    filename: filename,
    tabs: tabs,
    currentTab: currentTab,
    list: data,
  }

  if (tabs[currentTab] == undefined) {setCurrentTab(tabs.length - 1); return}

  return (
    <>
      <div id='heading'>
        <h1>ERDeity</h1>
        <h2><i>the json savior</i></h2>
        <div id='labelContainer'>
          <label htmlFor='fileInput' id='label'>
            <img src={uploadIcon} className='uploadIcon'/>
            Upload JSON definitions or ERDeity file
          </label>
        </div>
        <input type='file' onChange={handleUpload} id='fileInput'/>
      </div>
      <div id='main'>
        {data != 0 && <ERDlist erds={data.erds} funcs={funcs} data={ERDdata} /> }
        {data != 0 && <MyGUI erds={tabs[currentTab].erds} funcs={funcs} data={ERDdata}/>}
      </div>
      <p className='finePrint'>made by <a href='https://lukespine.com'>luke spine</a></p>
    </>
  )
}

const ERDlist = ( {erds, funcs, data} ) => {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    const input = document.getElementById('search').value.toLowerCase()
    setTimeout( () => {
      if (input == document.getElementById('search').value.toLowerCase())
      setQuery(input)
    }, 200 )
  }

  const Results = () => {
    let resultCount = 0
    return erds.map( (erd) => {
      if ( erd.name.toLowerCase().includes(query) || erd.id.toLowerCase().includes(query))
      if (resultCount < 128) {
        resultCount++
        return <ERD me={erd} key={erd.id} funcs={funcs} data={data} />
      }
    } )
}


  return (
    <div id='ERDlist'>
      <div className='moduleHeading'>
        <h3>All ERDs</h3>
        <p className='filename'><i>{data.filename}</i></p>
        <input type='text' onChange={handleSearch} id='search' placeholder='ERD name or ID'/>
      </div>
      <Results />
    </div>
  ) 
}

const MyGUI = ( {erds, funcs, data} ) => {
  const Results = () => erds.map( (erd, i) => {
    return <MyERD me={erd} key={erd.id} funcs={funcs} index={i} />
  } )
  const Tabs = () => data.tabs.map( (tab, i) => {
    const c = i == data.currentTab ? 'tab active' : 'tab'
    return (
      <div className={c} key={i} onClick={() => funcs.switchToTab(i)}>
        {tab.title}
        <img src={x} className='tabX' onClick={ () => funcs.closeTab(i) }/>
      </div>
    )
  } )

  useEffect( () => {
    const input = document.getElementById('tabNamer')
    if (document.activeElement !== input && input !== null) input.value = data.tabs[data.currentTab].title
  } )

  const save = () => {
      console.log('saving file')

      const GUIdata = {
        name: "My GUI",
        tabs: data.tabs.map( (tab, i) => {
          return {
            title: tab.title == '' ? 'Tab ' + (i + 1) : tab.title,
            erds: data.tabs[i].erds.map( (erd) => {
              return {
                namespace: data.namespace,
                name: erd.name,
                read: true,
                write: true,
                interval: erd.interval,
              }
            } ),
          }
        } )
      };
  
      const serializedData = JSON.stringify(GUIdata);
      const blob = new Blob([serializedData]);
      
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'GUI.json';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  const saveWorkspace = () => {
    const workspaceData = {
      list: data.list,
      gui: data.tabs
    };

    console.log(workspaceData)

    const serializedData = JSON.stringify(workspaceData);
    const blob = new Blob([serializedData], { type: 'application/erdeity' });
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'workspace.erdeity';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  
  const handleEmptyTabName = () => {
    if (document.getElementById('tabNamer').value == '') {
      document.getElementById('tabNamer').value = 'Tab ' + (data.currentTab + 1)
      funcs.nameTab(true)
    }
  }

  if (erds.length < 1 && data.tabs.length < 2 && data.tabs[0].title == 'New Tab') return (
    <div id='MyGUI' style={ {display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none'} }>
        <h3>Click + to configure a GUI</h3>
    </div>
  )
  return (
    <div id='MyGUI' onMouseLeave={handleEmptyTabName}>
      <div className='moduleHeading' style={ {paddingTop: 0} }>
        <div className='tabContainer' onMouseOver={handleEmptyTabName}>
          <Tabs />
          <div className='tab new' onClick={funcs.newTab}>
            <img src={plus} className='plusTab'/>
          </div>
        </div>
      </div>
      <div className='page'>
        <div className='namerContainer'>
          <img src={pencil} className='pencil'/>
          <input type='text' onChange={funcs.nameTab} onBlur={handleEmptyTabName} id='tabNamer' placeholder='Tab Name' maxLength={32}/>
        </div>


        <div className='saveWorkspace' onClick={saveWorkspace}>Save Workspace</div>
        <Results />
        <div className='saveGUI' onClick={save}>Save GUI</div>
      </div>
    </div>
    
  )
}

const ERD = ( {me, funcs, data} ) => {
  const checkTab = () => {
    for (const erd of data.tabs[data.currentTab].erds)
    if (erd.id == me.id) return true 
    return false
  }
  const inCurrentTab = checkTab()
  const boxContent = inCurrentTab ? <img src={check} className='check' /> : <img src={plus} className='plus' />
  const boxStyle = inCurrentTab ? {
    backgroundColor: 'green',
    alignItems: 'center',
    cursor: 'default'
  } : {}

  return (
    <div className='ERD'>
      <div className='ERDheader'>

        <div className='ERDheaderText'>
          <h4 className='ERDname'>{me.name} </h4>
          <p><code>{me.id}</code></p>
        </div>
        
        <div className='addContainer'>
          <div className='addButton' onClick={() => funcs.addERD(me)} style={boxStyle}>{boxContent}</div>
        </div>

      </div>
    </div>
  )
}

const MyERD = ( {me, funcs, index} ) => {
  const [dataShown, setDataShown] = useState(false)
  const toggleDataShown = () => {
    setDataShown(!dataShown)
  }

  const Type = () => {
    const primitive = <code className='type'>{me.data[0].type}</code>
    if (me.data.length > 1) return (
      <div className='typeContainer' onClick={toggleDataShown}>
        <span className="material-symbols-outlined">{!dataShown ? 'arrow_right' : 'arrow_drop_down'}</span>
        <p><code className='type'>{me.data.length} element array</code></p>
      </div>
    )
    else return (
      <div className='typeContainer' onClick={toggleDataShown}>
        <span className="material-symbols-outlined">{!dataShown ? 'arrow_right' : 'arrow_drop_down'}</span>
        <p>{primitive}</p>
      </div>
    )
  }

  let lastIntervalValue = me.interval
  const handleInterval = () => {
    const input = document.getElementById(me.id).value
    if (input == '') return
    else me.interval = parseInt(input)
  }
  const handleEmptyInput = () => {
    const inputField = document.getElementById(me.id)
    const input = inputField.value
    if (input == '') {
      inputField.value = lastIntervalValue
      me.interval = lastIntervalValue
    }
    else lastIntervalValue = parseInt(input)
  }

  const Elevator = () => {
    return (
      <div className='elevator'>
        <div className='up' onClick={() => funcs.move(index, 'up')}>
          <img className='up' src={up} />
        </div>
        <div className='down' onClick={() => funcs.move(index, 'down')}>
          <img className='down' src={up} />
        </div>
      </div>
    )
  }

  const JSONdata = () => {
    const data = JSON.stringify(me, undefined, 2)
    const newData = data.split('\n')
    return (
      <div className='ERDinfo'>
      {newData.map((str, i) => {
        if (str.includes('"interval": ')) return
          return <pre key={i}><p key={i}><code key={i} className='JSON'>{str + '\n'}</code></p></pre>
        } 
      )}
      </div>
  )
  }
  const ElementData = () => {
    const [JSONshown, setJSONshown] = useState(false)
    const toggleJSON = () => setJSONshown(!JSONshown)

    const MapEnumValues = () => {
      const content = []
      const enumValues = me.data[0].values
      Object.keys(enumValues).forEach(function(key, index) {
        content.push(
        <p key={index + 'm'} style={{wordBreak: 'break-all', marginLeft: '20px'}}>
          <code>
            {key}: {enumValues[key]}
          </code>
        </p>)
      });
      return content
    }

    const JSONdropdown = () => {
      return (
        <>
        <div className='typeContainer JSON' onClick={toggleJSON}>
          <span className="material-symbols-outlined">{!JSONshown ? 'arrow_right' : 'arrow_drop_down'}</span>
          <p>raw JSON</p>
        </div>
        {JSONshown && <JSONdata />}
        </>
      )
    }

    if (me.data[0].type == 'enum' && me.data.length == 1) return (
      <div className='ERDinfo'>
        <p>
          <code>
          name: {me.data[0].name}<br />
          type: {me.data[0].type}<br />
          offset: {me.data[0].offset}<br />
          size: {me.data[0].size}<br />
          values:</code>
        </p>
          <MapEnumValues />
        <JSONdropdown />
      </div>
    )
    if (me.data.length == 1) return (
      <div className='ERDinfo'>
        <p>
          <code>
          name: {me.data[0].name}<br />
          type: {me.data[0].type}<br />
          offset: {me.data[0].offset}<br />
          size: {me.data[0].size}<br />
          </code>
        </p>
        <JSONdropdown />
      </div>
    )
    if (me.data.length > 1) {
      console.log(me.data)
      return (
        <div className='ERDinfo'>
          {me.data.map( (element, i) => {
            if (element.type == 'enum') {
              const content = []
              const enumValues = me.data[i].values
              Object.keys(enumValues).forEach(function(key, index) {
                content.push(
                <p key={index + 'j'} style={{wordBreak: 'break-all', marginLeft: '20px'}}>
                  <code>
                    {key}: {enumValues[key]}
                  </code>
                </p>)
              });
              return (
                <div key={i}>
                  <p>
                    <code>
                      name: {me.data[i].name}<br />
                      type: {me.data[i].type}<br />
                      offset: {me.data[i].offset}<br />
                      size: {me.data[i].size}<br />
                      values:
                    </code>
                  </p>
                  {content}
                  <hr />
                </div>
              )
            } else return (
              <div key={i}>
                <p>
                  <code>
                  name: {me.data[i].name}<br />
                  type: {me.data[i].type}<br />
                  offset: {me.data[i].offset}<br />
                  size: {me.data[i].size}<br />
                  </code>
                </p>
                <hr />
              </div>
            )
          } )}
          <JSONdropdown />
        </div>
      )
    }
  }

  useEffect( () => {
    document.getElementById(me.id).value = me.interval
  } )

  return (
    <div className='ERD'>

      <div className='ERDheader'>
      <Elevator />
        <div className='myERDheaderText'>
          <div className='identityContainer'>
            <h4 className='ERDname'>{me.name} </h4>
            <p><code>{me.id}</code></p>
            <Type />
            {dataShown && 
            <>
              <ElementData />
              
            </>
            }
          </div>
          <div className='intervalContainer'>
            <p>interval: </p> <input type='number' min={10} max={1000000000} className='intervalInput' onChange={handleInterval} id={me.id} onBlur={handleEmptyInput}/>
          </div>
        </div>
        
        <div className='addContainer'>
          <div className='addButton GUI' onClick={ () => funcs.removeERD(me) }>
            <img className='x' src={plus} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
