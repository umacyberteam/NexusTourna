export const metadata = {
  title: "Tentang — Nexus Tournament",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl uppercase text-brand-700 mb-6">
        Tentang Nexus Tournament
      </h1>

      <div className="space-y-4 text-ink/80 leading-relaxed">
        <p className="font-semibold text-ink">Perkenalkan!</p>

        <p>
          Nexus Tournament adalah sebuah platform web yang dikembangkan oleh
          DevRulzz (Rulzz). Website ini dirancang untuk memudahkan siapa saja,
          khususnya panitia komunitas, dalam membuat, mengelola, dan mengikuti
          berbagai jenis turnamen secara lebih efisien dan terstruktur.
        </p>

        <p>
          Melalui Nexus Tournament, panitia dapat membuat turnamen dengan
          mengisi informasi yang diperlukan, seperti:
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>Judul turnamen</li>
          <li>Kategori game atau permainan</li>
          <li>Deskripsi turnamen (opsional)</li>
          <li>Rules atau peraturan</li>
          <li>Hadiah untuk pemenang</li>
          <li>Biaya pendaftaran</li>
          <li>Batas maksimal peserta</li>
          <li>Tanggal mulai pendaftaran</li>
          <li>Tanggal berakhir pendaftaran</li>
          <li>Banner turnamen (opsional)</li>
        </ul>

        <p>
          Setelah turnamen dipublikasikan, peserta dapat melihat seluruh
          informasi yang tersedia dan melakukan pendaftaran sesuai dengan
          ketentuan yang telah ditetapkan.
        </p>

        <h2 className="text-xl text-brand-700 pt-2">Fitur Terbaru</h2>

        <p>
          Nexus Tournament telah diperbarui dengan beberapa fitur tambahan
          untuk meningkatkan kenyamanan dan efisiensi pengguna, di antaranya:
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-medium">Search Tournament</span>, untuk
            menemukan turnamen dengan lebih cepat dan mudah.
          </li>
          <li>
            <span className="font-medium">Filter Tournament</span>, untuk
            menyaring turnamen berdasarkan kategori atau kebutuhan tertentu.
          </li>
          <li>
            <span className="font-medium">Exit Tournament</span>, memungkinkan
            peserta untuk keluar dari turnamen yang telah diikuti.
          </li>
          <li>
            <span className="font-medium">Share Link Pendaftaran</span>,
            memudahkan panitia dalam membagikan tautan pendaftaran kepada
            peserta.
          </li>
        </ul>

        <h2 className="text-xl text-brand-700 pt-2">Login yang Mudah</h2>

        <p>
          Proses login di Nexus Tournament dirancang agar sederhana dan mudah
          digunakan.
        </p>

        <p>
          Jika belum memiliki akun, pengguna cukup melakukan registrasi
          menggunakan alamat Gmail dan membuat password. Demi keamanan, sangat
          disarankan untuk tidak menggunakan password utama yang digunakan pada
          akun penting lainnya.
        </p>

        <p>
          Setelah registrasi selesai, pengguna dapat masuk ke halaman login
          dengan memasukkan Gmail dan password yang telah dibuat untuk mulai
          menggunakan seluruh fitur yang tersedia.
        </p>

        <h2 className="text-xl text-brand-700 pt-2">Kesimpulan</h2>

        <p>
          Nexus Tournament hadir sebagai solusi yang praktis, cepat, dan
          terorganisir dalam mengelola maupun mengikuti turnamen. Dengan
          tampilan yang sederhana, fitur yang mudah dipahami, serta tambahan
          fitur seperti pencarian, filter, keluar dari turnamen, dan berbagi
          tautan pendaftaran, platform ini diharapkan dapat menjadi wadah yang
          nyaman bagi komunitas untuk membuat, mencari, dan mengikuti turnamen
          tanpa proses yang rumit. Hidup sudah cukup kompleks, mengelola
          turnamen seharusnya tidak perlu dibuat lebih sulit.
        </p>
      </div>

      <p className="text-xs text-ink/40 text-center mt-12 pt-6 border-t border-ink/10">
        © 2026 DevRulzz Copyright Reserved
      </p>
    </div>
  );
}
