import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

// toastr 전역 설정
toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  timeOut: 5000,
  extendedTimeOut: 1000,
  preventDuplicates: true,
};

export default toastr;
