begin;

update storage.buckets
set allowed_mime_types = array[
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.apple.keynote',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.presentation',
  'text/markdown',
  'text/plain',
  'text/x-tex',
  'text/x-python',
  'text/javascript',
  'application/javascript',
  'text/typescript',
  'text/x-c',
  'text/x-c++',
  'text/x-rust',
  'text/x-go',
  'text/x-java-source',
  'application/x-ipynb+json',
  'application/zip'
]
where id = 'materials';

commit;
