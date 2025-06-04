import React from 'react'
import logo from "../assets/images/logo.png";
import ProfileInfo from './cards/ProfileInfo';
import { useNavigate } from "react-router-dom";
import SearchBar from './inputs/SearchBar';
import { MdCalendarToday } from 'react-icons/md';

const Navbar = ({userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
  onCalendarClick
}) => {

  const isToken = localStorage.getItem("token");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  }

  const handleSearch = ()=>{
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = ()=>{
    handleClearSearch();
    setSearchQuery("");
  };
  return (
    <div className='bg-white drop-shadow sticky top-0 z-10 flex items-center justify-between px-6 py-2'> 
            <img src={logo} alt="Travel Blog Logo" className="h-9 " />

            {isToken && (<> 
            <SearchBar
            value={searchQuery}
            onChange={({target})=>{
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
            />
            <button onClick={onCalendarClick} className="p-2 rounded hover:bg-cyan-100 ">
              <MdCalendarToday className="text-2xl text-cyan-600" />
            </button>
            <ProfileInfo userInfo={userInfo} onLogout={onLogout}/> {" "}
            </> 
            )}
    </div>
  )
}

export default Navbar