import { Modal } from '../Modal/Modal';
import './Loader.css';

export function Loader() {
  return (
    <Modal show size="sm">
      <div className=" d-flex justify-content-center align-items-center">
        <section
          className=" position-relative"
          style={{ width: '150px', height: '150px' }}
        >
          <div className="loader" data-testid="loader" />
          <div className="loading loading06">
            <span data-text="L">L</span>
            <span data-text="O">O</span>
            <span data-text="A">A</span>
            <span data-text="D">D</span>
            <span data-text="I">I</span>
            <span data-text="N">N</span>
            <span data-text="G">G</span>
            <span data-text=".">.</span>
            <span data-text=".">.</span>
            <span data-text=".">.</span>
          </div>
        </section>
      </div>
    </Modal>
  );
}
