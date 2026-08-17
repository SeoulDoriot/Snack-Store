// Profile and settings, grouped Apple-Settings style.
//
// The delivery profile, preferences and wishlist are kept on the device.
// Signing in adds order history across devices and, for staff, the admin area.
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import EmptyState from "@/components/common/EmptyState";
import {
  ChevronRightIcon,
  HeartIcon,
  TrashIcon,
} from "@/components/common/Icons";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNotify } from "@/context/NotificationContext";
import { formatPrice } from "@/utils/currency";
import { readLastOrder, STATUS_LABELS, type PlacedOrder } from "@/data/orders";
import styles from "@/styles/Settings.module.css";

const PROFILE_KEY = "hak-shop.profile";
const PREFS_KEY = "hak-shop.prefs";

interface Profile {
  name: string;
  studentId: string;
  batch: string;
  phone: string;
  dorm: string;
  room: string;
}

interface Prefs {
  orderUpdates: boolean;
  offers: boolean;
}

const DEFAULT_PROFILE: Profile = {
  name: "Guest",
  studentId: "",
  batch: "",
  phone: "",
  dorm: "Dorm B",
  room: "",
};

const DEFAULT_PREFS: Prefs = { orderUpdates: true, offers: false };

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  return parts
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

interface ToggleRowProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

function ToggleRow({ label, hint, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      className={`${styles.row} ${styles.rowButton}`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.rowBody}>
        <span className={styles.rowLabel}>{label}</span>
        {hint && <span className={styles.rowHint}>{hint}</span>}
      </span>
      <span className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}>
        <span className={styles.knob} />
      </span>
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { notify } = useNotify();
  const { favouriteProducts, toggleFavourite, add, clear } = useCart();
  const { user, isAdmin, available, signOut } = useAuth();

  const [profile, setProfile] = useLocalStorage<Profile>(
    PROFILE_KEY,
    DEFAULT_PROFILE
  );
  const [prefs, setPrefs] = useLocalStorage<Prefs>(PREFS_KEY, DEFAULT_PREFS);

  const [editing, setEditing] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => setLastOrder(readLastOrder()), []);

  function openEditor() {
    setDraft(profile);
    setEditing(true);
  }

  function saveProfile() {
    setProfile(draft);
    setEditing(false);
    notify("Profile updated", { text: "Your details have been saved." });
  }

  function setPref(key: keyof Prefs, value: boolean) {
    setPrefs((current) => ({ ...current, [key]: value }));
  }

  async function logout() {
    // Sign out of Supabase when there is a real session, then clear anything
    // held on this device either way.
    try {
      if (user) await signOut();
    } catch (error) {
      notify("Could not sign out", {
        text: (error as Error).message,
        tone: "error",
      });
      return;
    }

    setProfile(DEFAULT_PROFILE);
    setPrefs(DEFAULT_PREFS);
    clear();
    setLogoutOpen(false);
    notify("Signed out", { text: "Your details were cleared on this device." });
    router.push("/");
  }

  const address =
    profile.room.trim().length > 0
      ? `${profile.dorm}, room ${profile.room}`
      : profile.dorm;

  return (
    <>
      <Head>
        <title>Profile &amp; settings · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader title="Profile & settings" subtitle="Your account and preferences" />

        <div className={`appWidth ${styles.page}`}>
          <div className={styles.inner}>
            {/* ---- Profile card ---- */}
            <div className={styles.profile}>
              <span className={styles.avatar}>{initials(profile.name)}</span>
              <div className={styles.profileBody}>
                <p className={styles.profileName}>{profile.name || "Guest"}</p>
                <p className={styles.profileMeta}>
                  {profile.studentId
                    ? `${profile.studentId} · ${address}`
                    : address}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={openEditor}>
                Edit
              </Button>
            </div>

            {/* ---- Account ---- */}
            <section className={styles.group}>
              <h2 className={styles.groupTitle}>Account</h2>
              <div className={styles.rows}>
                {[
                  { label: "Name", value: profile.name || "Not set" },
                  { label: "Student ID", value: profile.studentId || "Not set" },
                  { label: "Batch", value: profile.batch || "Not set" },
                  { label: "Phone", value: profile.phone || "Not set" },
                  { label: "Dorm / location", value: address },
                ].map((row) => (
                  <button
                    key={row.label}
                    type="button"
                    className={`${styles.row} ${styles.rowButton}`}
                    onClick={openEditor}
                  >
                    <span className={styles.rowBody}>
                      <span className={styles.rowLabel}>{row.label}</span>
                    </span>
                    <span className={styles.rowValue}>
                      {row.value}
                      <ChevronRightIcon size={16} />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* ---- Wishlist ---- */}
            <section className={styles.group}>
              <h2 className={styles.groupTitle}>Wishlist</h2>
              <div className={styles.rows}>
                {favouriteProducts.length > 0 ? (
                  favouriteProducts.map((product) => (
                    <div key={product.id} className={styles.row}>
                      <span className={styles.wishThumb} aria-hidden>
                        {product.image}
                      </span>
                      <span className={styles.rowBody}>
                        <span className={styles.rowLabel}>{product.name}</span>
                        <span className={styles.rowHint}>
                          {formatPrice(product.price)} ·{" "}
                          {product.stock > 0 ? "In stock" : "Out of stock"}
                        </span>
                      </span>
                      <span className={styles.wishActions}>
                        <Button
                          size="xs"
                          onClick={() => {
                            add(product.id);
                            notify(`${product.name} added`);
                          }}
                          disabled={product.stock === 0}
                        >
                          Add
                        </Button>
                        <button
                          type="button"
                          className={styles.iconAction}
                          onClick={() => toggleFavourite(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                        >
                          <TrashIcon size={16} />
                        </button>
                      </span>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon={<HeartIcon size={22} />}
                    title="No saved items"
                    description="Tap the heart on any product to save it here."
                  />
                )}
              </div>
            </section>

            {/* ---- Orders and access ---- */}
            <section className={styles.group}>
              <h2 className={styles.groupTitle}>Orders</h2>
              <div className={styles.rows}>
                <button
                  type="button"
                  className={`${styles.row} ${styles.rowButton}`}
                  onClick={() => router.push("/account")}
                >
                  <span className={styles.rowBody}>
                    <span className={styles.rowLabel}>Order history</span>
                    <span className={styles.rowHint}>
                      {user
                        ? "Every order on your account"
                        : "Sign in to see your past orders"}
                    </span>
                  </span>
                  <span className={styles.rowValue}>
                    <ChevronRightIcon size={16} />
                  </span>
                </button>

                {lastOrder && (
                  <button
                    type="button"
                    className={`${styles.row} ${styles.rowButton}`}
                    onClick={() => router.push("/order-success")}
                  >
                    <span className={styles.rowBody}>
                      <span className={styles.rowLabel}>{lastOrder.id}</span>
                      <span className={styles.rowHint}>
                        Most recent order on this device ·{" "}
                        {formatPrice(lastOrder.total)}
                      </span>
                    </span>
                    <span className={styles.rowValue}>
                      <span className={styles.statusChip}>
                        {STATUS_LABELS[lastOrder.status]}
                      </span>
                      <ChevronRightIcon size={16} />
                    </span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    className={`${styles.row} ${styles.rowButton}`}
                    onClick={() => router.push("/admin")}
                  >
                    <span className={styles.rowBody}>
                      <span className={styles.rowLabel}>Staff dashboard</span>
                      <span className={styles.rowHint}>
                        Manage orders, products and stock
                      </span>
                    </span>
                    <span className={styles.rowValue}>
                      <ChevronRightIcon size={16} />
                    </span>
                  </button>
                )}
              </div>
            </section>

            {/* ---- Preferences ---- */}
            <section className={styles.group}>
              <h2 className={styles.groupTitle}>Notifications</h2>
              <div className={styles.rows}>
                <ToggleRow
                  label="Order updates"
                  hint="Tell me when my order status changes"
                  checked={prefs.orderUpdates}
                  onChange={(next) => setPref("orderUpdates", next)}
                />
                <ToggleRow
                  label="Offers and promos"
                  hint="Occasional deals on snacks and drinks"
                  checked={prefs.offers}
                  onChange={(next) => setPref("offers", next)}
                />
              </div>
            </section>

            {/* ---- Support ---- */}
            <section className={styles.group}>
              <h2 className={styles.groupTitle}>Support</h2>
              <div className={styles.rows}>
                <button
                  type="button"
                  className={`${styles.row} ${styles.rowButton}`}
                  onClick={() => setHelpOpen(true)}
                >
                  <span className={styles.rowBody}>
                    <span className={styles.rowLabel}>Help</span>
                    <span className={styles.rowHint}>
                      Delivery times, payment and contact
                    </span>
                  </span>
                  <span className={styles.rowValue}>
                    <ChevronRightIcon size={16} />
                  </span>
                </button>

                <div className={styles.row}>
                  <span className={styles.rowBody}>
                    <span className={styles.rowLabel}>Version</span>
                  </span>
                  <span className={styles.rowValue}>Prototype · mock data</span>
                </div>

                {user || !available ? (
                  <button
                    type="button"
                    className={`${styles.row} ${styles.rowButton}`}
                    onClick={() => setLogoutOpen(true)}
                  >
                    <span className={styles.rowBody}>
                      <span className={`${styles.rowLabel} ${styles.danger}`}>
                        Log out
                      </span>
                      <span className={styles.rowHint}>
                        {user ? user.email : "Clears this device"}
                      </span>
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${styles.row} ${styles.rowButton}`}
                    onClick={() => router.push("/auth/login")}
                  >
                    <span className={styles.rowBody}>
                      <span className={styles.rowLabel}>Sign in</span>
                      <span className={styles.rowHint}>
                        Keep your orders across devices
                      </span>
                    </span>
                    <span className={styles.rowValue}>
                      <ChevronRightIcon size={16} />
                    </span>
                  </button>
                )}
              </div>
            </section>

            <p className={styles.footNote}>
              Everything here is stored on this device only. Nothing is sent
              anywhere yet.
            </p>
          </div>
        </div>
      </PageLayout>

      {/* ---- Edit profile ---- */}
      <Modal
        open={editing}
        title="Edit your details"
        description="Used to deliver your orders."
        onClose={() => setEditing(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveProfile}>Save changes</Button>
          </>
        }
      >
        <div className={styles.editFields}>
          <Input
            label="Full name"
            value={draft.name}
            autoComplete="name"
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
          />
          <Input
            label="Student ID"
            value={draft.studentId}
            placeholder="KIT2024081"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                studentId: event.target.value,
              }))
            }
          />
          <Input
            label="Batch"
            value={draft.batch}
            placeholder="Batch 12"
            onChange={(event) =>
              setDraft((current) => ({ ...current, batch: event.target.value }))
            }
          />
          <Input
            label="Phone number"
            value={draft.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="012 345 678"
            onChange={(event) =>
              setDraft((current) => ({ ...current, phone: event.target.value }))
            }
          />
          <Input
            label="Dorm"
            value={draft.dorm}
            onChange={(event) =>
              setDraft((current) => ({ ...current, dorm: event.target.value }))
            }
          />
          <Input
            label="Room number"
            value={draft.room}
            inputMode="numeric"
            onChange={(event) =>
              setDraft((current) => ({ ...current, room: event.target.value }))
            }
          />
        </div>
      </Modal>

      {/* ---- Help ---- */}
      <Modal
        open={helpOpen}
        title="Help"
        onClose={() => setHelpOpen(false)}
        footer={<Button onClick={() => setHelpOpen(false)}>Got it</Button>}
      >
        <div className={styles.helpBody}>
          <p className={styles.helpItem}>
            <strong>Delivery</strong> — order before 9PM and we usually reach
            your dorm within 20 minutes.
          </p>
          <p className={styles.helpItem}>
            <strong>Payment</strong> — pay the runner on delivery with cash, ABA
            Pay or Wing.
          </p>
          <p className={styles.helpItem}>
            <strong>Contact</strong> — message the shop at Dorm B reception if
            something is wrong with your order.
          </p>
        </div>
      </Modal>

      {/* ---- Logout ---- */}
      <Modal
        open={logoutOpen}
        title="Log out?"
        description="This clears your saved details and bag on this device."
        onClose={() => setLogoutOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={logout}>
              Log out
            </Button>
          </>
        }
      />
    </>
  );
}
