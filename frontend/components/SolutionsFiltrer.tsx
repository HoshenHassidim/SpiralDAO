import React from "react";

interface SolutionsFiltersProps {
  // filterStatus: string;
  // setFilterStatus: (value: string) => void;
  filterEngage: string;
  setFilterEngage: (value: string) => void;
  filterRated: string;
  setFilterRated: (value: string) => void;
  sortOption: string;
  setsortOption: (value: string) => void;
  isClient: boolean;
  address: string | null;
  className?: string;
}

const SolutionsFilters: React.FC<SolutionsFiltersProps> = ({
  // filterStatus,
  // setFilterStatus,
  filterEngage,
  setFilterEngage,
  filterRated,
  setFilterRated,
  sortOption,
  setsortOption,
  isClient,
  address,
  className,
}) => {
  return (
    <div
      className={`flex flex-wrap flex-col md:flex-row gap-2 md:gap-4 items-center ${className}`}
    >
      {/* <select
        className="input-field"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option>All Solutions</option>
        <option>Awaiting Ranking</option>
        <option>In Solution Phase</option>
      </select> */}

      {isClient && address && (
        <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-4">
          <label className="self-center">Filter By:</label>

          <label className="self-center">My Intervention:</label>
          <select
            className="input-field"
            value={filterEngage}
            onChange={(e) => setFilterEngage(e.target.value)}
          >
            <option value="everything">All Solutions</option>
            <option value="my solutions">My Solutions</option>
            <option value="not my solution">Others' Solutions</option>
          </select>

          <label className="self-center">Rating:</label>
          <select
            className="input-field"
            value={filterRated}
            onChange={(e) => setFilterRated(e.target.value)}
          >
            <option>All</option>
            <option>Rated</option>
            <option>Not Rated</option>
          </select>
        </div>
      )}

      <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-4">
        <label className="self-center">Sort By:</label>
        <select
          className="input-field"
          value={sortOption}
          onChange={(e) => setsortOption(e.target.value)}
        >
          <option>Newest</option>
          <option>Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default SolutionsFilters;
