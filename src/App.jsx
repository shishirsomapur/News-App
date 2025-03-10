import React, { useEffect, useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FaBars } from 'react-icons/fa';

const App = () => {

  const [value, setValue] = useState("Search any news here...")
  const [news, setNews] = useState(null)
  const [dataloaded, setDataloaded] = useState(false)
  const [topic, setTopic] = useState(null)
  const [readLaterNews, setReadLaterNews] = useState([])
  const [showLater, setShowLater] = useState(false)
  const [searchTopic, setSearchTopic] = useState(null)
  const [searchNewsLoaded, setSearchNewsLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [])

  useEffect(() => {
    let newsArray = []
    if (searchTopic != null && dataloaded == false) {
      setDataloaded(true)
    }
    let searchNewsFunc = async () => {
      if (searchTopic != null) {
        var url = `https://newsapi.org/v2/everything?q=${searchTopic}&language=en&apiKey=a59f3ec6adf04c7c98c80a1d4ebeffd0`
        try {
          console.log(url)
          var req = new Request(url);
          let response = await fetch(req)
          response = await response.json()
          newsArray = (response.articles.filter(article => article.urlToImage != null)
            .map((article) => {
              return ({
                id: `${searchTopic}-${uuidv4()}`,
                title: article.title,
                description: article.description,
                image: article.urlToImage,
                isLater: false
              })
            }))
          newsArray = [...news, ...newsArray]
          setNews(newsArray)
          setSearchNewsLoaded(true)
        } catch (error) {
          console.error(error);
        }
      }
    }
    searchNewsFunc()
  }, [searchTopic])


  let fetchNews = async () => {
    let topics = ["sports", "technology", "politics"]
    let newsArray = []
    for (let x of topics) {
      var url = `https://newsapi.org/v2/everything?q=${x}&language=en&apiKey=a59f3ec6adf04c7c98c80a1d4ebeffd0`
      try {
        var req = new Request(url);
        let response = await fetch(req)
        response = await response.json()
        let filteredNews = (response.articles.filter(article => article.urlToImage != null)
          .map((article) => {
            return ({
              id: `${x}-${uuidv4()}`,
              title: article.title,
              description: article.description,
              image: article.urlToImage,
              isLater: false
            })
          }))
        newsArray = [...newsArray, ...filteredNews]
      } catch (error) {
        console.error(error);
      }
    }
    setNews(newsArray)
  }

  let handleClick = async (e) => {
    setIsMenuOpen(false)
    if (searchNewsLoaded) {
      setSearchNewsLoaded(false)
      setSearchTopic(null)
    }
    news.filter(item => { !item.id.includes(searchTopic) })
    setShowLater(false)
    let topic = e.target.dataset.topic
    setTopic(topic)
    if (dataloaded == false) {
      setDataloaded(true)
    }
  }

  const handleChange = (e) => {
    let value = e.target.value
    console.log(value)
    setValue(value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchTopic(value);
      setIsMenuOpen(false)
      if (showLater) {
        setShowLater(false)
      }
    }
  }

  const handleCheckbox = (id) => {
    setNews(news.map(item => {
      if (item.id === id) {
        console.log(item.id, id)
        item.isLater = !item.isLater;
        if (item.isLater) {
          setReadLaterNews([...readLaterNews, item]);
        } else {
          setReadLaterNews(readLaterNews.filter(newsItem => newsItem.id !== id));
        }
      }
      return item;
    }));
  };

  const handleLaterNews = () => {
    setShowLater(true)
  }

  function whichNews(item) {
    if (searchTopic != null) {
      return !item.isLater && item.id.includes(searchTopic)
    }
    else {
      return !item.isLater && item.id.includes(topic)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div>
      <nav className='flex bg-red-500 w-full items-center p-2 fixed ' >
        <div className='flex justify-between w-full'>
          <div>
            <p className=' mt-2 pl-2 lg:text-4xl text-3xl'>NEWS APP</p>
            {isMenuOpen ? <ul className='flex flex-col justify-between transition-all duration-300 ease-in-out'>
              <li className='text-lg font-semibold cursor-pointer m-2 '><a data-topic="sports" onClick={handleClick}>Sports</a></li>
              <li className='text-lg font-semibold cursor-pointer m-2 '><a data-topic="technology" onClick={handleClick}>Technology</a></li>
              <li className='text-lg font-semibold cursor-pointer m-2 '><a data-topic="politics" onClick={handleClick}>Politics</a></li>
              <li className='text-lg font-semibold cursor-pointer m-2 '><a onClick={handleLaterNews}>Read-This-Later</a></li>
              <input className='rounded-md mr-4 pl-1 border border-slate-950 w-52 m-2' type="text" value={value} onChange={handleChange} onKeyDown={handleKeyPress} />
            </ul> : null}
          </div>
          <div className='flex lg:hidden '>
            <button className='flex m-3 items-start'><FaBars className='mr-2 w-8 h-8 ' onClick={toggleMenu} /></button>
          </div>
          <div className='w-3/4 hidden lg:flex justify-between items-center'>
            <ul className='flex justify-between w-2/4 mr-4 items-center pl-2'>
              <li className='text-lg font-semibold cursor-pointer'><a data-topic="sports" onClick={handleClick}>Sports</a></li>
              <li className='text-lg font-semibold cursor-pointer'><a data-topic="technology" onClick={handleClick}>Technology</a></li>
              <li className='text-lg font-semibold cursor-pointer'><a data-topic="politics" onClick={handleClick}>Politics</a></li>
              <li className='text-lg font-semibold cursor-pointer'><a onClick={handleLaterNews}>Read-This-Later</a></li>
            </ul>
            <ul>
              <input className='rounded-md mr-4 pl-1 border border-slate-950 w-52' type="text" value={value} onChange={handleChange} onKeyDown={handleKeyPress} />
            </ul>
          </div>
        </div>
      </nav>
      <div className='flex flex-wrap pt-16 justify-evenly'>
        {showLater ? readLaterNews.map(item => (
          <div key={item.id} className='flex mt-3'>
            <div className='flex w-80 flex-col bg-slate-500 border rounded-md'>
              <img className='rounded-t-md h-40' src={item.image}></img>
              <div className='mt-2 ml-2 text-xs font-semibold flex items-center'>
                <input name={item.id} className='mr-1 h-5 w-3' type='checkbox' checked={item.isLater} onChange={() => handleCheckbox(item.id)} />
                <label>Read this later</label>
              </div>
              <p className='font-bold text-xl mt-2 mb-2 mr-2 ml-2'>{item.title}</p>
              <p className='mr-2 ml-2 pb-2'>{item.description}</p>
            </div>
          </div>
        )) : dataloaded && news.filter(whichNews)
          .map(item => (
            <div key={item.id} className='flex mt-3 '>
              <div className='flex w-80 flex-col bg-slate-500 border rounded-md'>
                <img className='rounded-t-md h-40' src={item.image}></img>
                <div className='mt-2 ml-2 text-xs font-semibold flex items-center'>
                  <input name={item.id} className='mr-1 h-5 w-3' type='checkbox' checked={item.isLater} onChange={() => handleCheckbox(item.id)} />
                  <label>Read this later</label>
                </div>
                <p className='font-bold text-xl mt-2 mb-2 mr-2 ml-2'>{item.title}</p>
                <p className='mr-2 ml-2 pb-2'>{item.description}</p>
              </div>
            </div>
          ))}

      </div>
    </div>
  )
}

export default App
