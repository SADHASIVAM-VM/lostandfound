import React, { useEffect, useState } from "react";
import { useCon } from "../controller/ContextController";
import useAccess from "../hook/useaccess";
import { toast } from "react-toastify";


const ReportItem = () => {


const [typee, setType] = useState("")
const {currentUserId,currentUser, user, getEditReport} = useCon();
const [imagesStore, setImageStore]= useState([])
const [Loader, setLoader]= useState(null)
const [imagePreview, setImagePreview]= useState([])
// console.log(imagesStore)
// console.log(currentUserId)
console.log(getEditReport)
const selectedType = typee || getEditReport?.itemType;
// console.log(user)
useEffect(()=>{
  currentUser()

  // checking wheather edit or not
  if(getEditReport){
    setFormData(getEditReport)
  }
},[user])

const [formData, setFormData] = useState({
    user_id:"",
    itemName: "",
    category: "",
    dateLostOrFound: "",
    reward:"",
    location: "",
    description: "", 
    contactName: "",
    contactNumber: "",
    reportedBy:'',
  });

console.log(imagesStore)
useEffect(()=>{
  if(currentUserId?.[0]){
    setFormData((prev)=>({
      ...prev,
      user_id:currentUserId[0]._id,
      reportedBy:currentUserId[0]._id,
   
      
  }))
  }
},[currentUserId, typee])

//  console.log(CurrentUserData)

  // Handle Input Changes
  const handleChange = (e) => {

    const {name, value} = e.target;
    setFormData({ ...formData,  [name]:value });
  };

  // image handle
  const handleFileChange=(e)=>{
      const selectedFile = e.target.files[0]
      setImageStore(selectedFile)
      setImagePreview(URL.createObjectURL(selectedFile))
        
  }
const handleMethod = getEditReport ?"PUT":"POST";
console.log(handleMethod)
  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const FM = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
        FM.append(key, value);
    });
    console.log(FM)
    if (imagesStore) {
        FM.append('images', imagesStore);
    }
    !getEditReport && FM.append('itemType', typee);

    try {
        const url = getEditReport 
          ? `${import.meta.env.VITE_PUBLIC_URL}item/update/${getEditReport._id}`
          : `${import.meta.env.VITE_PUBLIC_URL}item`;

        const response = await fetch(url, {
            method: getEditReport ? "PUT" : "POST",
            body: FM,
        });

        const data = await response.json(); // Await JSON parsing

        if (response.ok) {
            toast.success(`Successfully ${getEditReport ? "updated" : "posted"}`);
        } else {
            toast.error(`Failed to ${getEditReport ? "update" : "post"}`);
        }
    } catch (error) {
        toast.error("An error occurred while submitting.");
    } finally {
        setLoader(false);
    }
};


   
    

  return (
    <div className=" shadow-lg rounded-lg p-6 md:w-6xl mx-auto bg-white m-5 relative">
      <h2 className="text-2xl font-bold text-center">
        Post Lost & Found Item
      </h2>
      <p className="text-gray-500 text-center mb-4">
        Fill in the details about the item you lost or found.
      </p>

      {/* Toggle Lost/Found Type */}
      <p className="inline text-[12px] text-white bg-blue-500 px-3 py-1  rounded-sm">Select Type</p>
      <div className="flex  gap-4 my-3">
        <label className={`flex  space-x-2 ${selectedType == "lost" && "bg-yellow-400"} text-black font-bold border p-2 rounded-xl`} onClick={()=> setType("lost")}>
         
          <span>Lost Item</span>
        </label>
        <label className={`flex  space-x-2 ${selectedType == "found" && "bg-yellow-400"} text-black font-bold border p-2 rounded-xl`} onClick={()=> setType("found")}>
         
         <span>Found Item</span>
       </label>
      </div>

      {/* Form */}
      <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Name */}
        <div>
          <label className="block text-left pb-2 font-medium text-black">Item Name *</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2  rounded-md  border-gray-600 focus:ring py-3 border "
            placeholder="E.g. Wallet, Phone, Keys"
          />
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-left pb-2  font-medium text-  ">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2  rounded-md  border-gray-600  focus:ring py-3 border "
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="documents">Documents</option>
              <option value="jewelry">Jewelry</option>
              <option value="clothing">Clothing</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-left pb-2  font-medium text-  ">Date *</label>
           <input
              type="date"
              name="dateLostOrFound"
              value={formData.dateLostOrFound}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border-gray-600 focus:ring py-3 border "
            />
          </div>
        </div>

        {/* Location & Reward */}
        <div className="flex gap-3 w-full">
        <div className="flex-1">
          <label className="block text-left pb-2  font-medium text-  ">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md  border-gray-600 focus:ring py-3  "
            placeholder="Where was it lost/found?"
          />
        </div>
       {
        typee=="lost"&& <div className="flex-1">
        <label className="block text-left pb-2  font-medium text-  ">Reward </label>
        <input
          type="text"
          name="reward"
          value={formData.reward}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-md  border-gray-600 focus:ring py-3  "
          placeholder="E.g. $20"
        />
      </div>
       }
        </div>

        {/* Description */}
        <div>
          <label className="block text-left pb-2  font-medium text-  ">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full mt-1 p-2 border rounded-md  border-gray-600  py-3 "
            placeholder="Provide detailed description..."
          ></textarea>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-left pb-2  font-medium text-  ">Upload Images</label>
          <div
            className="mt-1 p-10 border-2 border-dashed rounded-md text-center text-gray-500 cursor-pointer"
          >
            <div className="flex gap-3 my-5">
            {imagePreview.length !== 0  &&
              <img src={imagePreview} className="w-[50px] h-[50px]"/>
            }
            </div>
            <input type="file" name="images" className="text-blue-600" onChange={handleFileChange}/>
           
          </div>
          
        </div>

        {/* Contact Name & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-left pb-2  font-medium text-  ">Contact Name *</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-gray-600  rounded-md focus:ring "
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-left pb-2  font-medium text-  ">Contact Phone *</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-gray-600  rounded-md  "
              placeholder="Your phone number"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button type="button" className="bg-red-400 px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Report
          </button>
        </div>
      </form>
     {
       selectedType == null  && <div className={`bg-[#f4f4f4] opacity-75 w-full h-full absolute top-0 right-0`}></div>
      
     }
      </div>
      {
      Loader? <div className="w-full h-[100%] left-0 absolute top-0 flex justify-center items-center bg-[#00000088] 
       ">
        <div className="loader"></div>
      </div>:''
     }
    </div>
  );
};

export default ReportItem;
