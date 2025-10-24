/**
 * QuickNotesCard Component
 * Displays quick notes with add functionality
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, TextInput, ScrollView } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Add, Note, Heart, Star1, Danger, InfoCircle, TickCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { QuickNotesCardProps } from '@/types/dateProfile';

type NoteStyle = 'default' | 'important' | 'love' | 'idea' | 'reminder';

const noteStyles = {
  default: { icon: Note, color: Colors.purple, bg: `${Colors.purple}10`, border: `${Colors.purple}30` },
  important: { icon: Danger, color: '#FF4444', bg: '#FFE5E5', border: '#FFCCCC' },
  love: { icon: Heart, color: '#FF6B9D', bg: 'rgba(255, 107, 157, 0.1)', border: 'rgba(255, 107, 157, 0.2)' },
  idea: { icon: Star1, color: '#FFA500', bg: '#FFF4E5', border: '#FFE5CC' },
  reminder: { icon: TickCircle, color: '#4CAF50', bg: '#E8F5E9', border: '#C8E6C9' },
};

export default function QuickNotesCard({ notes, onAddNote, onEditNote }: QuickNotesCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteStyle, setNoteStyle] = useState<NoteStyle>('default');

  const handleAddNoteClick = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Call parent's onAddNote to navigate to Notes category
    onAddNote();
  };

  const handleEditNote = (note: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedNote(note);
    setNoteContent(note.content);
    setNoteStyle(note.style || 'default');
    setShowModal(true);
  };

  const handleSave = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // TODO: Save to database
    setShowModal(false);
    if (selectedNote) {
      onEditNote(selectedNote.id);
    } else {
      onAddNote();
    }
  };

  const handleSelectStyle = (style: NoteStyle) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNoteStyle(style);
  };

  return (
    <>
      <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Quick Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNoteClick}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Add size={18} color={Colors.textWhite} variant="Outline" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {notes.length > 0 ? (
        <View style={styles.notesList}>
          {notes.map((note) => {
            const style = noteStyles[note.style as NoteStyle] || noteStyles.default;
            const IconComponent = style.icon;
            return (
              <TouchableOpacity
                key={note.id}
                style={[
                  styles.noteItem,
                  { backgroundColor: style.bg, borderColor: style.border }
                ]}
                activeOpacity={0.7}
                onPress={() => handleEditNote(note)}
              >
                <View style={[styles.noteIcon, { backgroundColor: style.color }]}>
                  <IconComponent size={16} color={Colors.textWhite} variant="Bold" />
                </View>
                <Text style={styles.noteText} numberOfLines={3}>
                  {note.content}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Note size={48} color={Colors.textSecondary} variant="Outline" />
          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={styles.emptyText}>Tap + to add your first note</Text>
        </View>
      )}
    </View>

      {/* Add/Edit Note Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {selectedNote ? 'Edit Note' : 'Add Quick Note'}
            </Text>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              {/* Note Style Selector */}
              <View style={styles.styleSection}>
                <Text style={styles.styleLabel}>Note Style</Text>
                <View style={styles.styleOptions}>
                  {(Object.keys(noteStyles) as NoteStyle[]).map((key) => {
                    const style = noteStyles[key];
                    const IconComponent = style.icon;
                    const isSelected = noteStyle === key;
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.styleOption,
                          { backgroundColor: style.bg, borderColor: style.border },
                          isSelected && styles.styleOptionSelected
                        ]}
                        onPress={() => handleSelectStyle(key)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.styleIcon, { backgroundColor: style.color }]}>
                          <IconComponent size={18} color={Colors.textWhite} variant="Bold" />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Note Content */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Note Content</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Write your note here..."
                  placeholderTextColor={Colors.textSecondary}
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={!noteContent.trim()}
              >
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.saveButtonText}>
                    {selectedNote ? 'Save Changes' : 'Add Note'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesList: {
    gap: Spacing.sm,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  noteIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  styleSection: {
    marginBottom: Spacing.xl,
  },
  styleLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  styleOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  styleOption: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleOptionSelected: {
    borderWidth: 3,
    borderColor: Colors.purple,
  },
  styleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSection: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  textArea: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 120,
  },
  modalActions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  saveButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
