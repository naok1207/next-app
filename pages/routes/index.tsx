import Link from 'next/link';
import { FC } from 'react';
import { Path } from '../../shared/utils/Path'

const regexColon = new RegExp(':');

const Row: FC<{name: string, path: string}> = ({name, path}) => {
  if (regexColon.test(path)) return <p>{name} {path}</p>;

  return (
    <Link href={path}>
      <a>
        <p>{name} {path}</p>
      </a>
    </Link>
  )
}

const Routes = () => {
  const datas: JSX.Element[] = [];

  // @ts-ignore
  const showRoutes = (target, parentKey = '') => {
    const keys = Object.keys(target);
    keys.map((key) => {
      const newTarget = target[key] as string;
      // @ts-ignore
      if (newTarget?.index) {
        showRoutes(newTarget, key);
      } else {
        datas.push(<Row name={parentKey + ' ' + key} path={newTarget} />)
      }
    })
  }

  showRoutes(Path);

  return (
    <>
      <div>Routes</div>
      <div>
        {datas}
      </div>
    </>
  )
}

export default Routes;
