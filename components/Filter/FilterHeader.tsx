'use client';

interface CommonFilterHeaderProps {
  readonly resetButton: () => void;
}

export default function FilterHeader({ resetButton }: CommonFilterHeaderProps) {
  return (
    <div className=" d-flex justify-content-between align-items-center">
      <h6 className=" fw-semibold m-0 "> Filters</h6>
      <button
        type="button"
        className="d-flex justify-content-between align-items-center  border-0 bg-white"
        onClick={() => resetButton()}
      >
        <span className="resetAll_btn ">Reset All</span>
        {/* <span className=" ps-2">
          <Image src={reset} alt="reset" />
        </span> */}
      </button>
    </div>
  );
}
