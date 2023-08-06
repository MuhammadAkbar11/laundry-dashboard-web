import React from 'react';

type Props = { title: string };

function MemberPageHeader({ title }: Props) {
  return (
    <div>
      <h1 className=" text-accent1 text-capitalize fw-semibold ">{title}</h1>
      <hr />
    </div>
  );
}

export default MemberPageHeader;
