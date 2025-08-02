import React, { createContext, useContext, useState } from "react";

// Create the context
const MemberContext = createContext();

// Custom hook
export const useMemberContext = () => useContext(MemberContext);

// Provider component
export const MemberProvider = ({ children }) => {
  const [members, setMembers] = useState([]);

  // Add a new member
  const addMember = (newMember) => {
    setMembers((prevMembers) => [...prevMembers, newMember]);
  };

  // Delete a member by ID
  const deleteMember = (id) => {
    setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
  };

  // Update a member by ID
  const updateMember = (updatedMember) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) => (member.id === updatedMember.id ? updatedMember : member))
    );
  };

  return (
    <MemberContext.Provider value={{ members, addMember, deleteMember, updateMember }}>
      {children}
    </MemberContext.Provider>
  );
};
