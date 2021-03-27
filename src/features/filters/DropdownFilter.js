import React, { useState, useEffect } from 'react'

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export const DropdownFilter = ({ dropdownList, dropDownTitle, parentCallback, clearSelection}) => {
  const [currentSelection, setCurrentSelection] = useState("");

  useEffect(() => {
   setCurrentSelection(null);
  }, [clearSelection])
  
  const changeSelection = (e) => {
    setCurrentSelection(e.value);
    parentCallback(e.value);
  }

  dropdownList.sort(function(first, second){       
    if(null == first || null == second) {
        return -1;
    }
        return first.localeCompare(second)
  });

  return (
                <>
                    <div className="">
                        <label className=""> {dropDownTitle} </label>
                        <Dropdown options = {dropdownList}
                                  onChange = {(e) => changeSelection(e)}
                                  value = {currentSelection}
                                  placeholder = "Selectare" />
                    </div>
                </>
            );
}

export default DropdownFilter;