import { APP_NAME } from '@configs/varsConfig';
import Link from 'next/link';
import React from 'react';

type Props = {};

export default function AdminFooter({}: Props) {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row text-muted">
          <div className="col-6 text-start">
            <div className="mb-0">
              <div>
                <Link className="text-muted" href="/">
                  <strong>{APP_NAME}</strong>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-6 text-end">
            <ul className="list-inline">
              <li className="list-inline-item">
                <a
                  className="text-muted"
                  href="https://adminkit.io/"
                  target="_blank"
                >
                  Support
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  className="text-muted"
                  href="https://adminkit.io/"
                  target="_blank"
                >
                  Help Center
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  className="text-muted"
                  href="https://adminkit.io/"
                  target="_blank"
                >
                  Privacy
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  className="text-muted"
                  href="https://adminkit.io/"
                  target="_blank"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
