"use client";

const FilterButtons = ({ currentFilter, setFilter }) => {
  const filters = [
    { key: "all", label: "All" },
    { key: "hot", label: "Hot" },
    { key: "sale", label: "Sale" },
  ];

  return (
    <div className="d-flex flex-wrap gap-2 mb-3 button_new">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => setFilter(filter.key)}
          className={`btn btn-outline-dark ${currentFilter === filter.key ? "active" : ""}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
