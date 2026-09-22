import Dropdown from '@/components/Dropdown/DropDown';
import Skeleton from 'react-loading-skeleton';
import MemberWrapper from './AccountWrapper';

function Loading() {
  return (
    <MemberWrapper>
      {Array.from(Array(25).keys()).map((i) => (
        <tr key={i}>
          <th className="ms-1">
            <Skeleton />
          </th>
          <th>
            <Skeleton />
          </th>
          <th>
            <Skeleton />
          </th>
          <th>
            <Skeleton />
          </th>
          <th>
            <Skeleton />
          </th>
          <th>
            <Skeleton />
          </th>
          <th>
            <Skeleton />
          </th>
          <th>
            <Dropdown />
          </th>
        </tr>
      ))}
    </MemberWrapper>
  );
}

export default Loading;
