import React, {useState, useEffect} from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from '../../components/cards/TravelStoryCard';
import { ToastContainer, toast} from 'react-toastify';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/cards/EmptyCard';
import moment from 'moment/moment';
import { DayPicker } from 'react-day-picker';
import FilterInfoTitle from '../../components/cards/FilterInfoTitle';
import { getEmptyCardImg, getEmptyCardMsg } from '../../utils/helper';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const[dateRange, setDateRange] = useState({from:null, to:null});

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add", // or "edit"
    data: null // data to edit, if type is "edit"
});


const [openViewModal, setOpenViewModal] = useState({
  isShown: false,
  data: null,
});
  

  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get("/user");
      if(response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    }catch(error){
      if(error.response && error.response.status===401){
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  const getAllStories = async () => {
    try{
      const response = await axiosInstance.get("/get-all-stories");
      if(response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    }catch(error){
      console.log("An unexpected error occurred while fetching stories.");
    }
  }

  const handleEdit = (data) =>{
    setOpenAddEditModal({isShown: true, type: "edit", data: data});

  }

  const handleViewStory = (data) =>{
    setOpenViewModal({isShown: true, data})
  }

  const updateIsFavorite = async(data) =>{
    const storyId = data._id;

    try{
      const response = await axiosInstance.put("/update-is-fav/"+storyId, 
        { isFavorite: !data.isFavorite });

      if(response.data && response.data.story) {
        toast.success("Story updated successfully!");
        getAllStories(); // Refresh the stories list after updating favorite status
      }
    }catch(error){
      console.log("An unexpected error occurred while fetching stories.");
    }
  }

  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllStories();
      }
    } catch (error) {
      console.error(error);
    }
  };


  const onSearchStory = async(query)=>{
    try{
      const response = await axiosInstance.get("/search",{
        params:{
          query,
        }
    });
    if(response.data && response.data.stories){
      setFilterType("search");
      setAllStories(response.data.stories)
    }
    }catch(error){
      console.log("An unexpected error occured. Try later")
    }
  };

  const handleClearSearch = ()=>{
    setFilterType("");
    getAllStories();
  };

  const filterStoriesBydate= async(day)=>{
    try{
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if(startDate&&endDate){
        const response = await axiosInstance.get("/filter", {
          params: {startDate, endDate},
        });

        if(response.data && response.data.stories){
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    }catch(error){

    }
  }

  const handleDayClick = (range) =>{
    setDateRange(range);
    filterStoriesBydate(range);
  }

  const resetFilter = ()=>{
    setDateRange({from: null, to:null})
    setFilterType("")
    setShowCalendar(false);
    getAllStories();
  }



  useEffect(() => {
    getAllStories();
    getUserInfo();
    return () =>{};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
        onCalendarClick={() => setShowCalendar((prev) => !prev)}
      />

        {showCalendar && (
        <div
          style={{
            position: 'absolute',
            top: 60, // adjust as needed to appear below your navbar
            right: 40, // adjust as needed to align with the icon
            zIndex: 1000,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '1rem'
          }}
        >
          <DayPicker
            captionLayout='dropdown-buttons'
            mode='range'
            selected={dateRange}
            onSelect={handleDayClick}
            pagedNavigation
          />
        </div>
      )}



      <div className='container mx-auto py-10'>

        <FilterInfoTitle 
        filterType={filterType}
        filterDates={dateRange}
        onClear={()=>{resetFilter();}}
        
        />

        <div className='flex-gap-7'>
          <div className='flex-1'>
            {allStories.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {allStories.map((item) => {
                return (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl = {item.imageUrl}
                    title = {item.title}
                    story={item.story}
                    date = {item.visitedDate}
                    visitedLocation = {item.visitedLocation}
                    isFavorite = {item.isFavorite}
                    onEdit = {() => handleEdit(item)}
                    onClick = {()=> handleViewStory(item)}
                    onFavoriteClick= {() => updateIsFavorite(item)}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyCard imgsrc={getEmptyCardImg(filterType)} message={getEmptyCardMsg(filterType)}/>
          )}
          </div>

          <div className='w-[320px]'>
            
          </div>
        </div>
      </div>



      <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={() => {}}
      style={{
        overlay :{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 999,
        },
      }}
      appElement={document.getElementById('root')}
      className="modal-box">

      <AddEditTravelStory 
      type={openAddEditModal.type}
      storyInfo = {openAddEditModal.data}
      onClose = {()=>{setOpenAddEditModal({isShown: false, type: "add", data: null})}}

      getAllStories={getAllStories}
      
      />

      </Modal>

      {/* view story model*/}
      <Modal
      isOpen={openViewModal.isShown}
      onRequestClose={() => {}}
      style={{
        overlay :{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 999,
        },
      }}
      appElement={document.getElementById('root')}
      className="modal-box"> 

      <ViewTravelStory
      storyInfo={openViewModal.data || null}
      onClose = {()=>{
        setOpenViewModal((prevState) => ({...prevState, isShown:false}));
      }}
      onEditClick = {()=>{
        setOpenViewModal((prevState) => ({...prevState, isShown:false}));
        handleEdit(openViewModal.data || null)
      }}
      onDeleteClick={()=>{
        deleteTravelStory(openViewModal.data || null );
      }}
      />
      
      </Modal>


      <button className='w-16 h-16 flex items-center justify-center rounded-full bg-[#05B6D3] hover:bg-cyan-400 fixed bottom-10 right-10 shadow-lg shadow-cyan-200/50 transition-all ease-in-out z-50' 
      onClick={() => {
        setOpenAddEditModal({isShown: true, type: "add", data: null});
      }}>

        <MdAdd className="text-[32px] text-white"/>
      </button>

      <ToastContainer/>

    </>
  )
}

export default Home