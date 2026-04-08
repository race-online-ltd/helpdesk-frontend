import React from 'react';
import Select from 'react-select';

const NoOptionsMessage = (props) => {
  const { onDeepSearch, isLoading, options, searchValue } = props.selectProps;

  if (isLoading) {
    return <div style={{ padding: '10px' }}>Searching...</div>;
  }

  const hasSearch = typeof searchValue === 'string';

  const showDeepSearch =
    onDeepSearch &&
    !isLoading &&
    options?.length === 0 &&
    hasSearch && // ✅ only if searchValue provided
    searchValue.trim().length > 2; // ✅ only when NOT typing
  console.log('NoOptionsMessage props:', searchValue); // Debug log
  return (
    <div style={{ padding: '10px', textAlign: 'center' }}>
      <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '13px' }}>
        No options found
      </div>

      {showDeepSearch && (
        <button type="button" onClick={onDeepSearch} className="custom-btn">
          Deep Search
        </button>
      )}
    </div>
  );
};

export const SelectDropdown = ({
  id,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  isMulti,
  onDeepSearch,
  onInputChange,
  inputValue,
  isLoading = false,
  searchValue,
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '30px',
      height: 'auto',
      width: '100%',
      // borderRadius: "0px 5px 5px 0px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      // height: "30px",
      padding: '0 6px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '30px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <Select
      id={id}
      className="form-control"
      options={options}
      placeholder={placeholder}
      styles={customStyles}
      {...(searchValue !== undefined && { searchValue })}
      value={
        isMulti
          ? options.filter((option) => value && value.includes(option.value))
          : (options && options.find((option) => option.value === value)) || null
      }
      onChange={(selectedOption) => {
        if (isMulti) {
          onChange(selectedOption.map((option) => option.value));
        } else {
          onChange(selectedOption ? selectedOption.value : '');
        }
      }}
      isLoading={isLoading}
      {...(onInputChange && {
        ...(inputValue !== undefined && { inputValue }),
        onInputChange: (value, meta) => {
          if (meta.action === 'input-change') {
            onInputChange(value);
          }
          return value;
        },
      })}
      isDisabled={disabled}
      isMulti={isMulti}
      onDeepSearch={onDeepSearch} // ✅ inject
      components={{
        NoOptionsMessage,
      }}
    />
  );
};
