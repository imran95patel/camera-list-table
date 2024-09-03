import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
import { IoWifiOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import img from "../assets/wobotLogo.svg";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdNotInterested } from "react-icons/md";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { BsCloud } from "react-icons/bs";
import "react-circular-progressbar/dist/styles.css";
import { GET_CAMERA, UPDATE_CAMERA } from "../constants";
import ConfirmationPopup from "./ConfirmationPopup";

const CameraTable = (props) => {
  const [cameraData, setCameraData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = import.meta.env.VITE_TOKEN;

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await axios.get(apiUrl + GET_CAMERA, {
        headers: {
          Authorization: token,
        },
      });

      setCameraData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const updateCameraStatus = async (id, status) => {
    try {
      const payload = {
        id: id,
        status: status,
      };

      await axios.put(apiUrl + UPDATE_CAMERA, payload, {
        headers: {
          Authorization: token,
        },
      });
      fetchCameras();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const deleteCamera = () => {
    const updatedData = cameraData.filter(
      (camera) => camera.id !== cameraToDelete
    );
    setCameraData(updatedData);
    setShowModal(false);
  };
  const filteredData = Array.isArray(cameraData)
    ? cameraData
        .filter((camera) =>
          camera.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((camera) =>
          locationFilter ? camera.location === locationFilter : true
        )
        .filter((camera) =>
          statusFilter ? camera.status === statusFilter : true
        )
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteClick = (id) => {
    setCameraToDelete(id);
    setShowModal(true);
  };

  return (
    <>
      <div className="container md:mx-auto md:p-4 md:bg-[#F9F9F9]">
        <div className=" flex items-center justify-end md:justify-center">
          <img src={img} alt="" />
        </div>
        <div className="flex flex-col md:gap-4 md:flex-row md:items-center  md:justify-between ">
          <div className="flex text-start flex-col mb-2">
            <h2 className="font-semibold text-xl ">Cameras</h2>
            <p className="text-gray-500  font-semibold   w-full">
              Manage your cameras here
            </p>
          </div>

          <div className="relative flex flex-col items-end mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-12 border rounded-xl py-2 w-full"
            />
            <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex justify-between md:justify-start items-center mb-4">
          <div className="relative">
            <CiLocationOn className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 w-5 h-5" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="py-2 pl-10 pr-4 border rounded-lg"
            >
              <option value="">Location</option>
              {cameraData.map((camera, index) => (
                <option key={index} value={camera.location}>
                  {camera.location}
                </option>
              ))}
            </select>
          </div>

          <div className="relative ml-4">
            {" "}
            <IoWifiOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 w-5 h-5 rotate-45" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 pl-10 pr-4 rounded-lg border"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4  border-b-2 flex items-center gap-8 ml-3">
                <input type="checkbox" />
                NAME
              </th>
              <th className="p-3 border-b-2">HEALTH</th>
              <th className="p-3 border-b-2">LOCATION</th>
              <th className="p-3 border-b-2">RECORDER</th>
              <th className="p-3 border-b-2">TASKS</th>
              <th className="p-3 border-b-2">STATUS</th>
              <th className="p-3 border-b-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentItems.map((camera) => (
              <tr key={camera.id} className="hover:bg-gray-100">
                <td className="p-3 border-b flex items-center justify-evenly ">
                  <input type="checkbox" className="" />{" "}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      camera.status === "Active" ? "bg-green-600" : "bg-red-600"
                    }`}
                  ></div>
                  {camera.name}
                </td>
                <td className="p-3 border-b ">
                  {
                    <div className="flex gap-2 items-center justify-center">
                      <BsCloud />
                      <CircularProgressbar
                        value={70}
                        text={`${camera.health.cloud}`}
                        styles={buildStyles({
                          rotation: 1,

                          strokeLinecap: "butt",

                          textSize: "24px",

                          pathTransitionDuration: 0.5,

                          pathColor:
                            camera.health.cloud === "A"
                              ? "rgba(0, 179, 60,0.8)"
                              : "rgba(255, 153, 51, 0.8)",
                          textColor: "#000000",
                          trailColor: "#f7fcfc",
                          backgroundColor: "#3e98c7",
                        })}
                        className="w-4 h-4 "
                      />
                      <RiArchiveDrawerLine />
                      <CircularProgressbar
                        value={70}
                        text={`${camera.health.device}`}
                        styles={buildStyles({
                          rotation: 1,

                          strokeLinecap: "butt",

                          textSize: "24px",

                          pathTransitionDuration: 0.5,

                          pathColor:
                            camera.health.device === "A"
                              ? "rgba(0, 179, 60,0.8)"
                              : camera.health.device === "-"
                              ? "rgba(230,230,230,0.8)"
                              : "rgba(255, 153, 51, 0.8)",
                          textColor: "#000000",
                          trailColor: "#f7fcfc",
                        })}
                        className="w-4 h-4"
                      />
                    </div>
                  }
                </td>
                <td className="p-3 border-b">{camera.location}</td>
                <td className="p-3 border-b">{camera.recorder || "N/A"}</td>
                <td className="p-3 border-b">{camera.tasks} Tasks</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() =>
                      updateCameraStatus(
                        camera.id,
                        camera.status === "Active" ? "Inactive" : "Active"
                      )
                    }
                    className={`px-4 py-1  ${
                      camera.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {camera.status}
                  </button>
                </td>
                <td className="p-3 border-b text-center">
                  <button onClick={() => handleDeleteClick(camera.id)}>
                    {camera.status === "Active" ? (
                      <IoIosCheckmarkCircleOutline />
                    ) : (
                      <MdNotInterested />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded"
          >
            Previous
          </button>
          <div className="text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmationPopup
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={deleteCamera}
        title="Confirm Deletion"
        message="Are you sure you want to delete this camera?"
      />
    </>
  );
};

export default CameraTable;
