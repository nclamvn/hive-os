import type { Locale } from "./config";
import type { DeepCopy } from "./copy-types";

const vi = {
  common: {
    email: "Email",
    password: "Mật khẩu",
    name: "Họ và tên",
    backToSignIn: "Quay lại đăng nhập",
    showPassword: "Hiện mật khẩu",
    hidePassword: "Ẩn mật khẩu",
    passwordRange: "Sử dụng {min}–{max} ký tự.",
  },
  signIn: {
    kicker: "KHÔNG GIAN NGHIÊN CỨU",
    localDemo: "Tài khoản thử nghiệm local đã được điền sẵn.",
    title: "Đăng nhập",
    description: "Truy cập không gian làm việc HIVE OS của bạn.",
    noAccount: "Chưa có tài khoản?",
    createOne: "Tạo tài khoản",
    signupDisabled:
      "Tính năng tự đăng ký đã tắt. Hãy đề nghị chủ sở hữu không gian làm việc gửi lời mời.",
    forgotPassword: "Quên mật khẩu?",
    submit: "Đăng nhập",
    busy: "Đang đăng nhập…",
    unable: "Không thể đăng nhập. Hãy kiểm tra thông tin và thử lại.",
    unverified:
      "Email của bạn chưa được xác minh. Hãy mở liên kết xác nhận trong hộp thư để hoàn tất đăng nhập.",
    resend: "Gửi lại email xác minh",
    resent:
      "Nếu tài khoản vẫn cần xác minh, một liên kết mới đang được gửi đến bạn.",
  },
  signUp: {
    unavailableTitle: "Không thể đăng ký",
    unavailableState: "Tính năng tự đăng ký đã tắt",
    unavailableHint:
      "Một chủ sở hữu không gian làm việc hiện có phải mời bạn tham gia.",
    title: "Tạo tài khoản",
    description: "Khởi tạo một không gian làm việc HIVE OS mới.",
    already: "Đã có tài khoản?",
    signIn: "Đăng nhập",
    requirement:
      "Sử dụng {min}–{max} ký tự. Bạn sẽ xác nhận email trước khi đăng nhập.",
    rangeError: "Mật khẩu phải có từ {min} đến {max} ký tự.",
    submit: "Tạo tài khoản",
    busy: "Đang tạo tài khoản…",
  },
  checkEmail: {
    signupTitle: "Xác nhận email",
    resetTitle: "Kiểm tra email",
    inbox: "Kiểm tra hộp thư đến",
    signupHint:
      "Chúng tôi đã gửi liên kết xác nhận để hoàn tất việc tạo tài khoản. Hãy mở liên kết để xác minh email rồi đăng nhập. Liên kết hết hạn sau 1 giờ.",
    resetHint:
      "Nếu có tài khoản tương ứng với email này, liên kết đặt lại mật khẩu đang được gửi đi. Liên kết hết hạn sau 30 phút.",
  },
  forgotPassword: {
    title: "Đặt lại mật khẩu",
    description: "Nhập email để nhận liên kết đặt lại mật khẩu.",
    outcome:
      "Nếu có tài khoản tương ứng với email này, liên kết đặt lại mật khẩu đang được gửi đi. Liên kết hết hạn sau 30 phút.",
    submit: "Gửi liên kết đặt lại",
    busy: "Đang gửi…",
  },
  resetPassword: {
    title: "Chọn mật khẩu mới",
    description: "Đặt mật khẩu mới cho tài khoản HIVE OS của bạn.",
    missing:
      "Liên kết đặt lại bị thiếu hoặc không hợp lệ. Hãy yêu cầu liên kết mới.",
    requestNew: "Yêu cầu liên kết đặt lại mới",
    newPassword: "Mật khẩu mới",
    confirm: "Xác nhận mật khẩu mới",
    mismatch: "Hai mật khẩu mới không khớp.",
    expired:
      "Liên kết đặt lại đã hết hạn hoặc đã được sử dụng. Hãy yêu cầu liên kết mới.",
    rangeError: "Mật khẩu phải có từ {min} đến {max} ký tự.",
    submit: "Cập nhật mật khẩu",
    busy: "Đang cập nhật…",
  },
  verifyEmail: {
    invalidTitle: "Liên kết xác minh không hợp lệ",
    invalidDescription:
      "Liên kết này không hợp lệ hoặc đã hết hạn. Hãy yêu cầu liên kết mới bên dưới.",
    unavailableTitle: "Chưa xác định trạng thái xác minh",
    unavailableDescription:
      "Hãy mở liên kết xác minh trong email hoặc yêu cầu liên kết mới bên dưới.",
    verifiedTitle: "Email đã được xác minh",
    confirmed: "Email của bạn đã được xác nhận",
    confirmedHint: "Bây giờ bạn có thể đăng nhập vào HIVE OS.",
    continue: "Tiếp tục đăng nhập",
    resendOutcome:
      "Nếu email này cần xác minh, một liên kết mới đang được gửi đi. Liên kết hết hạn sau 1 giờ.",
    resend: "Gửi lại liên kết xác minh",
    busy: "Đang gửi…",
  },
  onboarding: {
    title: "Tạo không gian làm việc",
    description:
      "Đặt tên cho không gian lưu trữ các nhiệm vụ. Bạn sẽ là chủ sở hữu.",
    name: "Tên không gian làm việc",
    submit: "Tạo không gian làm việc",
  },
  security: {
    title: "Bảo mật",
    description: "Quản lý mật khẩu, phiên đăng nhập và xác minh email.",
    back: "Quay lại không gian làm việc",
    email: "Email",
    verified: "Địa chỉ email của bạn đã được xác minh.",
    unverified: "Địa chỉ email của bạn chưa được xác minh.",
    resend: "Gửi lại email xác minh",
    resent: "Một liên kết xác minh mới đang được gửi đến bạn.",
    changePassword: "Đổi mật khẩu",
    currentPassword: "Mật khẩu hiện tại",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu mới",
    rangeError: "Mật khẩu mới phải có từ {min} đến {max} ký tự.",
    mismatch: "Hai mật khẩu mới không khớp.",
    changeFailed: "Không thể đổi mật khẩu. Hãy kiểm tra mật khẩu hiện tại.",
    changed: "Đã đổi mật khẩu. Các phiên khác đã được đăng xuất.",
    submit: "Cập nhật mật khẩu",
    busy: "Đang cập nhật…",
    sessions: "Phiên đăng nhập",
    sessionsHint: "Đăng xuất ở mọi nơi ngoại trừ thiết bị này.",
    revoke: "Thu hồi các phiên khác",
    revoked: "Các phiên khác đã được đăng xuất.",
  },
} as const;

const en: DeepCopy<typeof vi> = {
  common: {
    email: "Email",
    password: "Password",
    name: "Name",
    backToSignIn: "Back to sign in",
    showPassword: "Show password",
    hidePassword: "Hide password",
    passwordRange: "Use {min}–{max} characters.",
  },
  signIn: {
    kicker: "RESEARCH WORKSPACE",
    localDemo: "Local demo credentials are ready to use.",
    title: "Sign in",
    description: "Access your HIVE OS workspace.",
    noAccount: "No account?",
    createOne: "Create one",
    signupDisabled:
      "Self-sign-up is disabled. Ask a workspace owner for an invitation.",
    forgotPassword: "Forgot password?",
    submit: "Sign in",
    busy: "Signing in…",
    unable: "Unable to sign in. Check your details and try again.",
    unverified:
      "Your email isn't verified yet. Check your inbox for the confirmation link to finish signing in.",
    resend: "Resend verification email",
    resent:
      "If this account still needs verification, a new link is on its way.",
  },
  signUp: {
    unavailableTitle: "Sign-up unavailable",
    unavailableState: "Self-sign-up is disabled",
    unavailableHint: "An existing workspace owner must invite you to join.",
    title: "Create account",
    description: "Start a new HIVE OS workspace.",
    already: "Already have an account?",
    signIn: "Sign in",
    requirement:
      "Use {min}–{max} characters. You'll confirm your email before signing in.",
    rangeError: "Password must be between {min} and {max} characters.",
    submit: "Create account",
    busy: "Creating account…",
  },
  checkEmail: {
    signupTitle: "Confirm your email",
    resetTitle: "Check your email",
    inbox: "Check your inbox",
    signupHint:
      "We've sent a confirmation link to finish creating your account. Open it to verify your email, then sign in. The link expires in 1 hour.",
    resetHint:
      "If an account exists for that email, a password-reset link is on its way. The link expires in 30 minutes.",
  },
  forgotPassword: {
    title: "Reset password",
    description: "Enter your email and we'll send a reset link.",
    outcome:
      "If an account exists for that email, a password-reset link is on its way. The link expires in 30 minutes.",
    submit: "Send reset link",
    busy: "Sending…",
  },
  resetPassword: {
    title: "Choose a new password",
    description: "Set a new password for your HIVE OS account.",
    missing: "This reset link is missing or invalid. Request a new one.",
    requestNew: "Request a new reset link",
    newPassword: "New password",
    confirm: "Confirm new password",
    mismatch: "Passwords do not match.",
    expired:
      "This reset link has expired or already been used. Request a new one.",
    rangeError: "Password must be between {min} and {max} characters.",
    submit: "Update password",
    busy: "Updating…",
  },
  verifyEmail: {
    invalidTitle: "Verification link invalid",
    invalidDescription:
      "This link is invalid or has expired. Request a new one below.",
    unavailableTitle: "Verification status unavailable",
    unavailableDescription:
      "Open the verification link from your email, or request a new one below.",
    verifiedTitle: "Email verified",
    confirmed: "Your email is confirmed",
    confirmedHint: "You can now sign in to your HIVE OS workspace.",
    continue: "Continue to sign in",
    resendOutcome:
      "If that email needs verification, a new link is on its way. It expires in 1 hour.",
    resend: "Resend verification",
    busy: "Sending…",
  },
  onboarding: {
    title: "Create your workspace",
    description:
      "Name the workspace where your missions will live. You will be its owner.",
    name: "Workspace name",
    submit: "Create workspace",
  },
  security: {
    title: "Security",
    description: "Manage your password, sessions, and email verification.",
    back: "Back to workspace",
    email: "Email",
    verified: "Your email address is verified.",
    unverified: "Your email address is not verified yet.",
    resend: "Resend verification email",
    resent: "A new verification link is on its way.",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    rangeError: "New password must be between {min} and {max} characters.",
    mismatch: "New passwords do not match.",
    changeFailed: "Could not change password. Check your current password.",
    changed: "Password changed. Other sessions were signed out.",
    submit: "Update password",
    busy: "Updating…",
    sessions: "Sessions",
    sessionsHint: "Sign out everywhere except this device.",
    revoke: "Revoke other sessions",
    revoked: "Other sessions were signed out.",
  },
};

export const authCopy: Record<Locale, DeepCopy<typeof vi>> = { vi, en };

export function formatAuthCopy(
  value: string,
  values: Record<string, string | number>,
): string {
  return value.replace(/\{(\w+)\}/g, (_, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key)
      ? String(values[key])
      : `{${key}}`,
  );
}
